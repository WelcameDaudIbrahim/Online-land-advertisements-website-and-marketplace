"use server";

import { auth } from "@/auth";
import db from "@/db/db";
import { compress, sanitize } from "@/lib/utils";
import { createPostSchema, updatePostSchema } from "@/zodSchema/postSchema";
import { $Enums, Prisma } from "@prisma/client";
import { existsSync } from "fs";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import sharp from "sharp";

export async function post_exists(args: Prisma.postCountArgs) {
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
    .replaceAll(/[!@#$%^&*()+=[\]{};:'"<>/,.?|\\`~ ]/g, "_")
    .toLowerCase();

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

  const sharpImageBuffer = sharp(Buffer.from(await data.image.arrayBuffer()));
  const imageFilename = Date.now() + data.image.name.replaceAll(" ", "_");

  const { height: imageHeight, width: imageWidth } =
    await sharpImageBuffer.metadata();
  if (!imageHeight || !imageWidth) return;

  const imageWatermarkTop = Math.round((imageHeight - 56) / 2);
  const imageWatermarkLeft = Math.round((imageWidth - 193) / 2);

  const compressImage = await compress(
    sharpImageBuffer.composite([
      {
        input: await readFile(`${process.cwd()}/public/assets/watermark.png`),
        top: imageWatermarkTop,
        left: imageWatermarkLeft,
      },
    ]),
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
    return { title: ["Something Went Wrong!1"] };
  }

  const post = await db.post.create({
    data: {
      title: data.title,
      area: data.area,
      photo: `/posts/${imageFilename}`,
      facing: data.facing,
      parking: data.parking,
      selling_floor: data.selling_floor,
      total_floor: data.total_floor,
      transaction_type: data.transaction_type,
      balcony: data.balcony,
      total_land_area: data.total_land_area,
      bathroom: data.bathroom,
      price: data.price,
      availableFrom: data.property_for === "rent" ? data.availableFrom : null,
      negotiable: data.isNegotiable,
      bedroom: data.bedroom,
      property_for: data.property_for,
      tags: data.tags,
      amenities: [
        ...new Set(data.amenities.replaceAll("undefined", "").split(",")),
      ].join(","),
      property_type: data.property_type,
      phoneNumber: data.phoneNumber
        .toLowerCase()
        .replaceAll(/[^0-9.]/g, "")
        .replace("e", ""),
      slug,
      property_id,
      upazila: data.upazila,
      district: data.district,
      division: data.division,
      address: data.address,
      description: sanitize(data.description),
      user: { connect: { id: user_id } },
    },
  });

  const { photos } = data;

  var images_path: {
    image: string;
    postId: number;
  }[] = [];

  await Promise.all(
    photos.map(async (photo) => {
      const buffer = sharp(Buffer.from(await photo.arrayBuffer()));
      const filename = Date.now() + photo.name.replaceAll(" ", "_");

      const { height: imageHeight, width: imageWidth } =
        await buffer.metadata();
      if (!imageHeight || !imageWidth) return;

      const watermarkTop = Math.round((imageHeight - 56) / 2);
      const watermarkLeft = Math.round((imageWidth - 193) / 2);

      const image = await compress(
        buffer.composite([
          {
            input: await readFile(
              `${process.cwd()}/public/assets/watermark.png`
            ),
            top: watermarkTop,
            left: watermarkLeft,
          },
        ]),
        1024 * 540,
        photo.size
      );
      if (!image) return { photos: ["Something Went Wrong!2"] };

      try {
        const filepath = "public/posts/";
        await mkdir(filepath, { recursive: true });
        await writeFile(path.join(process.cwd(), filepath + filename), image);
        images_path.push({ image: `/posts/${filename}`, postId: post.id });
      } catch (error) {
        console.log(error);
        return { avatar: ["Something Went Wrong!3"] };
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
      select: { userId: true, user: { select: { emailVerified: true } } },
    });

    if (!isUsersPost || isUsersPost.userId !== user_id) {
      return { title: ["Something Went Wrong!"] };
    }
    if (isUsersPost.user.emailVerified === null) {
      return { title: ["You Must Verify Your E-mail"] };
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
            .replaceAll(/[!@#$%^&*()+=[\]{};:'"<>/,.?|\\`~ ]/g, "_")
            .toLowerCase(),
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
    select: { photo: true, image: { select: { image: true } } },
    // include: { image: true },
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
      facing: data.facing,
      parking: data.parking,
      selling_floor: data.selling_floor,
      total_floor: data.total_floor,
      transaction_type: data.transaction_type,
      balcony: data.balcony,
      total_land_area: data.total_land_area,
      bathroom: data.bathroom,
      bedroom: data.bedroom,
      price: data.price,
      amenities: [
        ...new Set(data.amenities.replaceAll("undefined", "").split(",")),
      ].join(","),
      availableFrom: data.property_for === "rent" ? data.availableFrom : null,
      negotiable: data.isNegotiable,
      tags: data.tags,
      property_for: data.property_for,
      property_type: data.property_type,
      phoneNumber: data.phoneNumber
        .toLowerCase()
        .replaceAll(/[^0-9.]/g, "")
        .replace("e", ""),
      ...slug,
      property_id,
      upazila: data.upazila,
      district: data.district,
      division: data.division,
      address: data.address,
      status: false,
      description: sanitize(data.description),
      user: { connect: { id: user_id } },
    },
  });

  const { photos } = data;

  const images_path: {
    image: string;
    postId: number;
  }[] = [];

  const existing_images_path: string[] = [];
  existingPost.image.map(({ image }) => {
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

export const getPosts = async ({
  deletedPost,
  propertyType,
  propertyFor,
  minAreaNumber,
  maxAreaNumber,
  bedroomNumber,
  bathroomNumber,
  page,
  take,
  search,
  user_id,
}: {
  deletedPost: boolean;
  propertyType?: $Enums.deletedpost_property_type | undefined;
  propertyFor?: $Enums.deletedpost_property_for | undefined;
  minAreaNumber?: number;
  maxAreaNumber?: number;
  bedroomNumber?: number;
  bathroomNumber?: number;
  page?: number;
  take?: number;
  search?: string;
  user_id?: string | undefined;
}) => {
  if (deletedPost === undefined) {
    deletedPost = false;
  }

  if (page === undefined) {
    page = 1;
  }

  if (take === undefined) {
    take = 10;
  }

  if (search === undefined) {
    search = "";
  }

  const pagination_query = { take: take, skip: page * take - take };

  let property_type = {};
  if (propertyType) property_type = { property_type: propertyType };

  let property_for = {};
  if (propertyFor) property_for = { property_for: propertyFor };

  let minArea = {};
  if (!!minAreaNumber) minArea = { gte: minAreaNumber };

  let maxArea = {};
  if (!!maxAreaNumber) maxArea = { lte: maxAreaNumber };

  let bedroom = {};
  if (!!bedroomNumber) bedroom = { bedroom: bedroomNumber };

  let bathroom = {};
  if (!!bathroomNumber) bathroom = { bathroom: bathroomNumber };

  let userId = {};
  if (!!user_id) userId = { user: { id: user_id } };

  const query = { take: take, skip: page * take - take };
  const posts = !deletedPost
    ? await db.post.findMany({
        where: {
          ...userId,
          OR: [
            {
              id: {
                equals: Number(search.replace(/\s+/g, " ")) || 0,
              },
            },
            {
              tags: {
                contains: search.replace(/\s+/g, " "),
              },
            },

            {
              property_id: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              title: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              upazila: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              address: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              division: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              district: {
                contains: search.replace(/\s+/g, " "),
              },
            },
          ],
          ...property_type,
          ...property_for,
          area: { ...minArea, ...maxArea },
          ...bathroom,
          ...bedroom,
        },
        ...pagination_query,
        select: {
          id: true,
          title: true,
          photo: true,
          area: true,
          property_for: true,
          property_type: true,
          property_id: true,
          pending: true,
          status: true,
          created_at: true,
          updated_at: true,
          userId: true,
        },
        ...query,
        orderBy: { created_at: "desc" },
      })
    : await db.deletedpost.findMany({
        where: {
          OR: [
            {
              id: {
                equals: Number(search.replace(/\s+/g, " ")),
              },
            },
            {
              property_id: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              title: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              upazila: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              address: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              division: {
                contains: search.replace(/\s+/g, " "),
              },
            },
            {
              district: {
                contains: search.replace(/\s+/g, " "),
              },
            },
          ],
          ...property_type,
          ...property_for,
          area: { ...minArea, ...maxArea },
          ...bathroom,
          ...bedroom,
        },
        select: {
          id: true,
          title: true,
          photo: true,
          area: true,
          property_for: true,
          property_type: true,
          property_id: true,
          pending: true,
          status: true,
          created_at: true,
          updated_at: true,
          userId: true,
        },
        orderBy: { created_at: "desc" },
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
    include: { image: true, user: true },
  });

  if (!existingPost) return;

  if (existingPost.image.length > 0) {
    await Promise.all(
      existingPost.image.map(async (photo) => {
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
    db.deletedpost.create({
      data: {
        amenities: existingPost.amenities,
        title: existingPost.title,
        area: existingPost.area,
        property_for: existingPost.property_for,
        property_type: existingPost.property_type,
        upazila: existingPost.upazila,
        address: existingPost.address,
        district: existingPost.district,
        division: existingPost.division,
        description: existingPost.description,
        property_id: existingPost.property_id,
        slug: existingPost.slug,
        facing: existingPost.facing,
        parking: existingPost.parking,
        selling_floor: existingPost.selling_floor,
        total_floor: existingPost.total_floor,
        transaction_type: existingPost.transaction_type,
        balcony: existingPost.balcony,
        total_land_area: existingPost.total_land_area,
        price: existingPost.price,
        availableFrom: existingPost.availableFrom,
        tags: existingPost.tags,
        phoneNumber: existingPost.phoneNumber,
        pending: existingPost.pending,
        bedroom: existingPost.bedroom,
        bathroom: existingPost.bathroom,
        negotiable: existingPost.negotiable,
        created_at: existingPost.created_at,
        post_id: existingPost.id,
        status: existingPost.status,
        updated_at: existingPost.updated_at,
        email: existingPost.user.email,
        name: existingPost.user.name,
        userId: existingPost.user.id,
        emailVerified: existingPost.user.emailVerified,
      },
    }),
  ]);

  revalidatePath("/admin/posts/all");
  return { title: ["Post Deleted Successfully"] };
};

export const changePendingStatus = async (slug: string, isPending: boolean) => {
  const user = await auth();

  if (!user || user === null) return;

  const post = await db.post.findUnique({
    where: { slug },
    select: { status: true, pending: true, id: true, user: true },
  });

  if (!post) return;
  if (post.pending === isPending)
    return { message: ["Post Updated Successfully"] };
  if (post.status === true) return;
  if (post.user.id !== user.user.id) return;

  await db.post.update({
    where: { id: post.id },
    data: {
      pending: isPending,
    },
  });
  revalidatePath("/user/my-posts");

  return { message: ["Post Updated Successfully"] };
};

export const deactivatePostStatus = async (slug: string) => {
  const user = await auth();

  if (!user || user === null) return;

  const post = await db.post.findUnique({
    where: { slug },
    select: { status: true, id: true, user: true },
  });

  if (!post) return;
  if (post.status === false)
    return { message: ["Post Deactivated Successfully"] };
  if (post.user.id !== user.user.id) return;

  await db.post.update({
    where: { id: post.id },
    data: {
      pending: false,
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
      pending: false,
      status: status,
    },
  });
  if (path) revalidatePath(path);
  return true;
};

export const getFilterPosts = async ({
  propertyType,
  propertyFor,
  minAreaNumber,
  maxAreaNumber,
  bedroomNumber,
  bathroomNumber,
  page,
  take,
  search,
}: {
  propertyType?: $Enums.post_property_type | undefined;
  propertyFor?: $Enums.post_property_for | undefined;
  minAreaNumber?: number;
  maxAreaNumber?: number;
  bedroomNumber?: number;
  bathroomNumber?: number;
  page?: number;
  take?: number;
  search?: string;
}) => {
  if (page === undefined) {
    page = 1;
  }

  if (take === undefined) {
    take = 1;
  }

  if (search === undefined) {
    search = "";
  }

  const pagination_query = { take: take, skip: page * take - take };

  let property_type = {};
  if (propertyType) property_type = { property_type: propertyType };

  let property_for = {};
  if (propertyFor) property_for = { property_for: propertyFor };

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
      OR: [
        {
          title: {
            contains: search.replace(/\s+/g, " "),
          },
        },
        {
          upazila: {
            contains: search.replace(/\s+/g, " "),
          },
        },
        {
          tags: {
            contains: search.replace(/\s+/g, " "),
          },
        },
        {
          address: {
            contains: search.replace(/\s+/g, " "),
          },
        },
        {
          division: {
            contains: search.replace(/\s+/g, " "),
          },
        },
        {
          district: {
            contains: search.replace(/\s+/g, " "),
          },
        },
      ],
      // description: {
      //   contains: search.replace(/\s+/g, " "),
      //         // },
      ...property_type,
      ...property_for,
      area: { ...minArea, ...maxArea },
      ...bathroom,
      ...bedroom,
    },
    ...pagination_query,
    select: {
      slug: true,
      title: true,
      bathroom: true,
      bedroom: true,
      photo: true,
      area: true,
      upazila: true,
      division: true,
      district: true,
      updated_at: true,
      property_for: true,
      property_type: true,
    },
    orderBy: { updated_at: "desc" },
  });
};
