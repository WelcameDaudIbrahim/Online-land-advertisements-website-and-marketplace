"use server";

import { auth } from "@/auth";
import db from "@/db/db";
import { compress, createFile, sanitize } from "@/lib/utils";
import { createPostSchema, updatePostSchema } from "@/zodSchema/postSchema";
import { $Enums, Prisma } from "@prisma/client";
import { log } from "console";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import path from "path";
import sharp from "sharp";

export async function post_exists(args: Prisma.PostCountArgs) {
  const count = await db.post.count(args);
  return Boolean(count);
}

export async function createPost(formData: FormData) {
  const result = createPostSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const user = await auth();

  if (!user || user.user.id === undefined) {
    return { title: ["Something Went Wrong!"] };
  }

  const user_id = user.user.id;

  const data = result.data;

  let slug = data.title
    .replaceAll(/[!@#$%^&*()+=[\]{};:'"<>,.?|\\`~ ]/g, "_")
    .toLocaleLowerCase();

  const isPostExist = await post_exists({ where: { slug } });

  let id = 0;
  const LastPost = await db.post.findMany({
    orderBy: { id: "desc" },
    select: { id: true },
    take: 1,
  });
  if (LastPost.length > 0) {
    id = LastPost[0].id;
  }
  const property_id = `ID4${user_id}${id + 1}`;
  if (isPostExist) {
    const post_exist_property_id = property_id.replaceAll(
      "ID",
      Math.floor(id / 34).toString()
    );
    slug = `${slug}_${post_exist_property_id}${id + 1}`;
  }
  data.photos = [];
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("photos") && key !== "photos") {
      data.photos?.push(value);
    }
  }

  data.photos.map((photo) => {
    if (!(photo instanceof File)) {
      return { title: ["Please Upload A Valid File"] };
    }
    if (photo.size > 1024 * 1024 * 5 || photo.size < 1) {
      return { title: ["Please Upload A Valid File"] };
    }
  });

  const imageBuffer = Buffer.from(await data.image.arrayBuffer());
  const imageFilename = Date.now() + data.image.name.replaceAll(" ", "_");

  const compressImage = await compress(
    sharp(imageBuffer),
    1024 * 540,
    data.image.size
  );
  if (!compressImage) return { image: ["Something Went Wrong!"] };

  try {
    const filepath = "public/posts/";
    await mkdir(filepath, { recursive: true });
    await writeFile(
      path.join(process.cwd(), filepath + imageFilename),
      compressImage
    );
  } catch (error) {
    console.log(error);
    return { title: ["Something Went Wrong!"] };
  }

  const post = await db.post.create({
    data: {
      title: data.title,
      area: data.area,
      photo: `/posts/${imageFilename}`,
      bathroom: data.bathroom,
      bedroom: data.bedroom,
      property_for: data.property_for,
      property_type: data.property_type,
      slug,
      property_id,
      thana: data.thana,
      district: data.district,
      division: data.division,
      location: data.location,
      description: sanitize(data.description),
      User: { connect: { id: user_id } },
    },
  });

  const { photos } = data;

  var images_path: {
    image: string;
    postId: number;
  }[] = [];

  await Promise.all(
    photos.map(async (photo) => {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const filename = Date.now() + photo.name.replaceAll(" ", "_");

      const image = await compress(sharp(buffer), 1024 * 540, photo.size);
      if (!image) return { photos: ["Something Went Wrong!"] };

      try {
        const filepath = "public/posts/";
        await mkdir(filepath, { recursive: true });
        await writeFile(path.join(process.cwd(), filepath + filename), image);
        images_path.push({ image: `/posts/${filename}`, postId: post.id });
      } catch (error) {
        console.log(error);
        return { avatar: ["Something Went Wrong!"] };
      }
    })
  );
  if (images_path.length > 0) {
    const image = await db.image.createMany({
      data: images_path,
    });
  }

  if (!post) {
    return { title: ["Creating Post Failed!"] };
  }

  // redirect("/admin/posts/all");
  return { title: ["Post Created Successfully"] };
}

export async function updatePost(formData: FormData, post_id: number) {
  const result = updatePostSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const user = await auth();

  if (!user || user.user.id === undefined) {
    return { title: ["Something Went Wrong!"] };
  }

  const user_id = user.user.id;

  const data = result.data;
  if (user.user.role !== "admin") {
    const isUsersPost = await db.post.findUnique({
      where: { id: post_id },
      select: { userId: true },
    });

    if (!isUsersPost || isUsersPost.userId !== user_id) {
      return { title: ["Something Went Wrong!"] };
    }
  }

  const existPost = await db.post.findUnique({
    where: { id: post_id },
    select: { property_id: true, title: true },
  });
  if (!existPost) {
    return { title: ["Something Went Wrong!"] };
  }

  const slug =
    data.title !== existPost.title
      ? {
          slug: data.title
            .replaceAll(/[!@#$%^&*()+=[\]{};:'"<>,.?|\\`~ ]/g, "_")
            .toLocaleLowerCase(),
        }
      : {};

  const property_id = `${existPost.property_id}`;

  data.photos = [];

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("photos") && key !== "photos") {
      data.photos?.push(value);
    }
  }

  data.photos.map((photo) => {
    if (!(photo instanceof File)) {
      return { title: ["Please Upload A Valid File"] };
    }
    if (photo.size > 1024 * 1024 * 5 || photo.size < 1) {
      return { title: ["Please Upload A Valid File"] };
    }
  });
  let imageFilename: string | undefined = undefined;

  const existingPost = await db.post.findUnique({
    where: { id: post_id },
    select: { photo: true, Images: { select: { image: true } } },
    // include: { Images: true },
  });

  if (!existingPost) {
    return { title: ["Something Went Wrong!"] };
  }

  if (data.image) {
    const imageBuffer = Buffer.from(await data.image.arrayBuffer());
    imageFilename = Date.now() + data.image.name.replaceAll(" ", "_");

    const compressImage = await compress(
      sharp(imageBuffer),
      1024 * 540,
      data.image.size
    );
    if (!compressImage) return { image: ["Something Went Wrong!"] };

    try {
      if (
        existsSync(path.join(process.cwd(), "/public/" + existingPost.photo))
      ) {
        await unlink(path.join(process.cwd(), "/public/" + existingPost.photo));
      }
      const filepath = "public/posts/";
      await mkdir(filepath, { recursive: true });
      await writeFile(
        path.join(process.cwd(), filepath + imageFilename),
        compressImage
      );
    } catch (error) {
      console.log(error);
      return { title: ["Something Went Wrong!"] };
    }
  }

  const photoPathname = imageFilename && `/posts/${imageFilename}`;

  const post = await db.post.update({
    where: { id: post_id },
    data: {
      title: data.title,
      area: data.area,
      photo: photoPathname || existingPost?.photo || "",
      bathroom: data.bathroom,
      bedroom: data.bedroom,
      property_for: data.property_for,
      property_type: data.property_type,
      ...slug,
      property_id,
      thana: data.thana,
      district: data.district,
      division: data.division,
      location: data.location,
      status: false,
      description: sanitize(data.description),
      User: { connect: { id: user_id } },
    },
  });

  const { photos } = data;

  const images_path: {
    image: string;
    postId: number;
  }[] = [];

  const existing_images_path: string[] = [];
  existingPost.Images.map(({ image }) => {
    const existingPost = image.replaceAll("/posts/", "");
    existing_images_path.push(existingPost);
  });

  const photos_name: string[] = [];
  photos.map((photo: File) => {
    photos_name.push(photo.name);
  });

  const newPhotos = photos.filter(
    (photo: File) => !existing_images_path.includes(photo.name)
  );

  const delete_images_path = existing_images_path.filter(
    (image: string) => !photos_name.includes(image)
  );

  if (delete_images_path.length > 0) {
    await Promise.all(
      delete_images_path.map(async (photo) => {
        if (existsSync(path.join(process.cwd(), "/public/posts/" + photo))) {
          await unlink(path.join(process.cwd(), "/public/posts/" + photo));
        }
      })
    );
  }

  if (newPhotos.length > 0) {
    await Promise.all(
      newPhotos.map(async (photo) => {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const filename = Date.now() + photo.name.replaceAll(" ", "_");

        const image = await compress(sharp(buffer), 1024 * 540, photo.size);
        if (!image) return { photos: ["Something Went Wrong!"] };

        try {
          const filepath = "public/posts/";
          await mkdir(filepath, { recursive: true });
          await writeFile(path.join(process.cwd(), filepath + filename), image);
          images_path.push({
            image: `/posts/${filename}`,
            postId: post.id,
          });
        } catch (error) {
          console.log(error);
          return { avatar: ["Something Went Wrong!"] };
        }
      })
    );
  }

  if (images_path.length > 0) {
    const image = await db.image.createMany({
      data: images_path,
    });
  }
  if (delete_images_path.length > 0) {
    await Promise.all(
      delete_images_path.map(async (image_path) => {
        await db.image.deleteMany({
          where: { image: `/posts/${image_path}`, postId: post.id },
        });
      })
    );
  }

  if (!post) {
    return { title: ["Updating Post Failed!"] };
  }
  if (user.user.role === "admin") {
    return redirect("/admin/posts/all");
  }
  return redirect("/user/my-posts");
  return { title: ["Post Updated Successfully"] };
}

export const getPosts = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      photo: true,
      area: true,
      property_for: true,
      property_type: true,
      property_id: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
  return posts;
};
export const deletePost = async (id: number) => {
  if (!id) return;
  const user = await auth();

  if (!user || user === null) return;

  if (user.user.role !== "admin") return;

  const existingPost = await db.post.findUnique({
    where: { id },
    include: { Images: true, User: true },
  });

  if (!existingPost) return;

  if (existingPost.Images.length > 0) {
    await Promise.all(
      existingPost.Images.map(async (photo) => {
        if (existsSync(path.join(process.cwd(), "/public/" + photo))) {
          await unlink(path.join(process.cwd(), "/public/" + photo));
        }
      })
    );
  }

  if (existsSync(path.join(process.cwd(), "/public/" + existingPost.photo))) {
    await unlink(path.join(process.cwd(), "/public/" + existingPost.photo));
  }

  const [deltedPost, post] = await db.$transaction([
    db.post.delete({ where: { id } }),
    db.deletedPost.create({
      data: {
        title: existingPost.title,
        area: existingPost.area,
        property_for: existingPost.property_for,
        property_type: existingPost.property_type,
        thana: existingPost.thana,
        location: existingPost.location,
        district: existingPost.district,
        division: existingPost.division,
        description: existingPost.description,
        property_id: existingPost.property_id,
        slug: existingPost.slug,
        bedroom: existingPost.bedroom,
        bathroom: existingPost.bathroom,
        created_at: existingPost.created_at,
        post_id: existingPost.id,
        status: existingPost.status,
        updated_at: existingPost.updated_at,
        email: existingPost.User.email,
        name: existingPost.User.name,
        userId: existingPost.User.id,
        emailVerified: existingPost.User.emailVerified,
      },
    }),
  ]);

  revalidatePath("/admin/posts/all");
  return { title: ["Post Deleted Successfully"] };
};
// const headersList = headers();
// const domain = headersList.get("host") || "";
// export const createFileFromUrl = async (images: string[]) => {
//   const formData = new FormData();
//   const files: File[] = [];
//   await Promise.all(
//     images.map(async (image) => {
//       const file = await createFile(
//         "http://" + domain + image,
//         image.split("/").at(-1) || "image.png",
//         "image/" + image.split(".").at(-1) || "image/png"
//       );
//       if (file) {
//         files.push(file);
//       }
//     })
//   );
//   formData.append("file", "files[0]");
//   return formData;
// };

export const deactivatePostStatus = async (slug: string) => {
  const user = await auth();

  if (!user || user === null) return;

  const post = await db.post.findUnique({
    where: { slug },
    select: { status: true, id: true, User: true },
  });

  if (!post) return;
  if (post.status === false)
    return { message: ["Post Deactivated Successfully"] };
  if (post.User.id !== user.user.id) return;

  await db.post.update({
    where: { id: post.id },
    data: {
      status: false,
    },
  });
  revalidatePath("/user/my-posts");

  return { message: ["Post Deactivated Successfully"] };
};
export const updatePostStatus = async (
  id: number,
  status: boolean,
  path?: string
) => {
  if (!id) return;

  const user = await auth();

  if (!user || user === null) return;

  if (user.user.role !== "admin") return;

  const post = await db.post.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!post) return;
  if (post.status === status) return true;

  await db.post.update({
    where: { id },
    data: {
      status: status,
    },
  });
  if (path) revalidatePath(path);
  return true;
};

export const getFilterPosts = async (
  properyType: $Enums.PropertyType | undefined = undefined,
  properyFor: $Enums.PropertyFor | undefined = undefined,
  minAreaNumber: number = 0,
  maxAreaNumber: number = 0,
  bedroomNumber: number = 0,
  bathroomNumber: number = 0
) => {
  let property_type = {};
  if (properyType) property_type = { property_type: properyType };

  let property_for = {};
  if (properyFor) property_for = { property_for: properyFor };

  let minArea = {};
  if (!!minAreaNumber) minArea = { gte: minAreaNumber };

  let maxArea = {};
  if (!!maxAreaNumber) maxArea = { lte: maxAreaNumber };

  let bedroom = {};
  if (!!bedroomNumber) bedroom = { bedroom: bedroomNumber };

  let bathroom = {};
  if (!!bathroomNumber) bathroom = { bathroom: bathroomNumber };

  return await db.post.findMany({
    where: {
      status: true,
      ...property_type,
      ...property_for,
      area: { ...minArea, ...maxArea },
      ...bathroom,
      ...bedroom,
    },
    take: 12,
    select: {
      slug: true,
      title: true,
      bathroom: true,
      bedroom: true,
      photo: true,
      area: true,
      thana: true,
      division: true,
      district: true,
      updated_at: true,
      property_for: true,
      property_type: true,
    },
    orderBy: { updated_at: "desc" },
  });
};
