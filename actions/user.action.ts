"use server";

import { auth } from "@/auth";
import db from "@/db/db";
import { compress } from "@/lib/utils";
import {
  avatarSchema,
  changePasswordSchema,
  settingsSchema,
} from "@/zodSchema/userSchema";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { compare, hash } from "bcryptjs";

export const updateSettings = async (
  prevState: unknown,
  formData: FormData
) => {
  const result = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const user = await auth();

  if (!user) {
    return {
      error: "Something Went Wrong",
    };
  }
  if (user.user.id === undefined) {
    return {
      error: "Something Went Wrong",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { id: user?.user.id },
    select: { name: true, email: true },
  });

  if (!existingUser) {
    return {
      error: "Something Went Wrong",
    };
  }

  const { name, email } = result.data;

  if (existingUser.name === name && existingUser.email === email) {
    return {
      error: "Something Went Wrong",
    };
  }
  if (existingUser.email !== email) {
    const matchingUser = await db.user.findUnique({ where: { email } });

    if (matchingUser) {
      return {
        error: "This Email Already Exist In The Database",
      };
    }
  }

  await db.user.update({ where: { id: user?.user.id }, data: { name, email } });

  return { error: "200" };
};

export const changeAvatar = async (prevState: unknown, formData: FormData) => {
  const result = avatarSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { avatar } = result.data;

  const buffer = Buffer.from(await avatar.arrayBuffer());
  const filename = Date.now() + avatar.name.replaceAll(" ", "_");

  const image = await compress(sharp(buffer), 1024 * 20, avatar.size);
  if (!image) return { avatar: ["Something Went Wrong!"] };

  const user = await auth();

  if (!user || user.user.image === null) {
    return { avatar: ["Something Went Wrong!"] };
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: { image: true },
  });

  if (!existingUser || existingUser.image !== user.user.image) {
    return { avatar: ["Something Went Wrong!"] };
  }
  try {
    const filepath = "public/uploads/avatar/";

    if (existingUser.image !== "/assets/profile.png") {
      if (
        existsSync(path.join(process.cwd(), "/public/" + existingUser.image))
      ) {
        await unlink(path.join(process.cwd(), "/public/" + existingUser.image));
      }
    }
    await mkdir(filepath, { recursive: true });
    await writeFile(path.join(process.cwd(), filepath + filename), image);
  } catch (error) {
    console.log(error);
    return { avatar: ["Something Went Wrong!"] };
  }

  await db.user.update({
    where: { id: user.user.id },
    data: { image: `/uploads/avatar/${filename}` },
  });

  return { avatar: ["200"] };
};

export const changePassword = async (
  prevState: unknown,
  formData: FormData
) => {
  const result = changePasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const user = await auth();

  if (!user) return { currentPassword: ["Something Went Wrong"] };

  const existingUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: { id: true, password: true },
  });
  if (!existingUser) return { currentPassword: ["Something Went Wrong"] };
  if (!existingUser.password) {
    return { currentPassword: ["You Don't Sign Up Using Credentials"] };
  }

  const { currentPassword, newPassword } = result.data;

  const isPasswordMatch = await compare(currentPassword, existingUser.password);

  if (!isPasswordMatch) return { currentPassword: ["Invalid Password"] };
  if (currentPassword === newPassword) {
    return {
      currentPassword: ["You'r Current Password Can't Be Your New Pasword."],
    };
  }

  const newHashedPassword = await hash(newPassword, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: newHashedPassword },
  });
  return { currentPassword: ["Password Changed Successfully"] };
};
