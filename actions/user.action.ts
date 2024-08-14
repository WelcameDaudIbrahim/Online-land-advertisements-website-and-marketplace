"use server";

import { v4 as uuidv4 } from "uuid";
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
import { sendVerificationMail } from "./mail";

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

  if (existingUser.email === email && existingUser.name === name) {
    return {
      error: "Something Must Change",
    };
  }

  if (existingUser.email !== email) {
    const matchingUser = await db.user.findUnique({ where: { email } });

    if (matchingUser) {
      return {
        error: "This Email Already Exist In The Database",
      };
    }

    await sendVerification(email);
    await db.user.update({
      where: { id: user?.user.id },
      data: { name, email, emailVerified: null },
    });
  } else {
    await db.user.update({
      where: { id: user?.user.id },
      data: { name },
    });
  }
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

export const getEmailByToken = async (token: string) => {
  const verification_token = await db.verificationToken.findUnique({
    where: { token },
    select: { email: true },
  });
  if (!verification_token) return null;
  return verification_token.email;
};

export const getTokenByUserId = async (id: string) => {
  const verification_token = await db.verificationToken.findFirst({
    where: { user_id: id },
    select: { token: true },
  });
  if (!verification_token) return null;
  return verification_token.token;
};
export const getTokenByEmail = async (email: string) => {
  const verification_token = await db.verificationToken.findFirst({
    where: { email },
    select: { token: true },
  });
  if (!verification_token) return null;
  return verification_token.token;
};

export const sendVerification = async (email: string) => {
  const existingUser = await db.user.findUnique({
    where: { email },
    select: { emailVerified: true, id: true },
  });
  if (!existingUser || existingUser.emailVerified) return null;

  const existingToken = await getTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { token: existingToken },
    });
  }

  const token = await db.verificationToken.create({
    data: {
      email,
      user_id: existingUser.id,
      token: uuidv4(),
      expires: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  sendVerificationMail({
    email,
    link: `${process.env.NEXT_SITE_URL}/verification/${token.token}/`,
  });

  return true;
};
