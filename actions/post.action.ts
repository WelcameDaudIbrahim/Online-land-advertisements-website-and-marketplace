"use server";

import db from "@/db/db";
import { sanitize } from "@/lib/utils";
import { createPostSchema } from "@/zodSchema/postSchema";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export async function post_exists(args: Prisma.PostCountArgs) {
  const count = await db.post.count(args);
  return Boolean(count);
}

export async function createPost(prevState: unknown, formData: FormData) {
  const result = createPostSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log(Object.fromEntries(formData));
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const user_id = 1;

  const data = result.data;

  let slug = data.title
    .replaceAll(/[!@#$%^&*()+=[\]{};:'"<>,.?|\\`~ ]/g, "_")
    .toLocaleLowerCase();

  const isPostExist = await post_exists({ where: { slug } });

  const [{ id }] = await db.post.findMany({
    orderBy: { id: "desc" },
    select: { id: true },
    take: 1,
  });
  const property_id = `ID4${user_id}${id + 1}`;
  if (isPostExist) {
    const post_exist_property_id = property_id.replaceAll(
      "ID",
      Math.floor(id / 34).toString()
    );
    slug = `${slug}_${post_exist_property_id}${id + 1}`;
  }
  console.log(result.data);

  // const post = await db.post.create({
  //   data: {
  //     title: data.title,
  //     area: data.area,
  //     image: "/assets/logo.png",
  //     bathroom: data.bathroom,
  //     bedroom: data.bedroom,
  //     property_for: data.property_for,
  //     property_type: data.property_type,
  //     slug,
  //     property_id,
  //     description: sanitize(data.description),
  //     // User: { connect: { id: 2 } },
  //     userId: 2,
  //   },
  // });

  // if (!post) {
  //   return { title: ["Creating Post Failed!"] };
  // }

  redirect("/admin/posts/all");
}
