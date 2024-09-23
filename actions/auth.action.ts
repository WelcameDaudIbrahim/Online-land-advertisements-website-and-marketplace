"use server";

import db from "@/db/db";
import { v4 as uuidv4 } from "uuid";
import {
  changeForgotPassword,
  forgotEmailSchema,
  logInSchema,
  signUpSchema,
} from "@/zodSchema/authSchema";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes";
import { sendVerification } from "./user.action";
import { sendResetPasswordMail } from "./mail";
import { contactToSellerSchema, contactUsSchema } from "@/zodSchema/userSchema";

export const login = async (prevState: unknown, formData: FormData) => {
  const result = logInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const { email, password } = result.data;

  try {
    const user = await signIn("credentials", {
      email,
      password,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something Went Wrong" };
      }
    }

    throw err;
  }
  return { error: "200" };
};

export const getResetPasswordEmail = async (token: string) => {
  if (!token || token === "") {
    return false;
  }

  const resetPasswordToken = await db.resetpasswordtoken.findUnique({
    where: { token },
    select: { email: true, expires: true, token: true },
  });

  if (!resetPasswordToken) {
    return false;
  }

  if (resetPasswordToken.expires < new Date()) {
    await db.resetpasswordtoken.delete({
      where: { token: resetPasswordToken.token },
    });
    return false;
  }

  return {
    token: resetPasswordToken.token,
    email: resetPasswordToken.email,
  };
};
export const forgotPasswordChange = async (
  token: string,
  prevState: unknown,
  formData: FormData
) => {
  const result = changeForgotPassword.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const { password, confirmPassword } = result.data;

  if (password !== confirmPassword) {
    return { error: "Password And Confirm Password Do Not Match" };
  }

  const existingToken = await getResetPasswordEmail(token);

  if (!existingToken) {
    return { error: "Something Went Wrong" };
  }

  await db.resetpasswordtoken.delete({
    where: { token: existingToken.token },
  });

  const hashedPassword = await hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { error: "Something Went Wrong" };
  }

  await db.user.update({
    where: { email: existingToken.email },
    data: { password: hashedPassword },
  });

  return { error: "200" };
};
export const forgotPasswordEmailSent = async (
  prevState: unknown,
  formData: FormData
) => {
  const result = forgotEmailSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const { email } = result.data;

  const user = await db.user.findUnique({
    where: { email },
    select: { email: true, id: true },
  });

  if (!user) {
    return { error: "Email Not Found" };
  }

  const existingToken = await db.resetpasswordtoken.findFirst({
    where: { user_id: user.id },
  });

  if (existingToken) {
    await db.resetpasswordtoken.deleteMany({ where: { user_id: user.id } });
  }

  const token = await db.resetpasswordtoken.create({
    data: {
      email,
      user_id: user.id,
      token: uuidv4(),
      expires: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  sendResetPasswordMail({
    email: user.email,
    link: `${process.env.NEXT_PUBLIC_SITE_URL}/forgot-password/${token.token}/`,
  });
  return { error: "Reset Password Email Has Sent." };
};

export const sign_out = async (url: string = "") => {
  await signOut();
  redirect(url);
};

export const signup = async (prevState: unknown, formData: FormData) => {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const { name, email, password } = result.data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      error: "This Email Already Exist In The Database",
    };
  }

  const hashedPassword = await hash(password, 10);

  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  await sendVerification(user.email);

  try {
    await signIn("credentials", {
      email: user.email,
      password,
      redirectTo: DEFAULT_REDIRECT_AFTER_LOGIN,
    });
  } catch (err) {
    console.log(err);
    // return { error: "Something Went Wrong" };
  }

  return { error: "200" };
  redirect(DEFAULT_REDIRECT_AFTER_LOGIN);
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });

  return user;
};

export const getUserByEmail = async (
  email: string,
  args?: Omit<Prisma.userFindUniqueArgs, "where">
) => {
  try {
    const user = await db.user.findUnique({ where: { email }, ...args });

    return user;
  } catch {
    return null;
  }
};

export const sendContactUs = async (
  post_id: number | undefined,
  prevState: unknown,
  formData: FormData
) => {
  if (!post_id) {
    const result = contactUsSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return { ...result.error.formErrors.fieldErrors, error: "" };
    }

    const { name, email, subject, message } = result.data;

    await db.contactus.create({
      data: { name, email, subject, message },
    });
  } else {
    const result = contactToSellerSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!result.success) {
      return { ...result.error.formErrors.fieldErrors, error: "" };
    }

    const { name, email, phoneNumber, message } = result.data;

    const post = await db.post.findUnique({
      where: { id: post_id },
      select: { userId: true, id: true },
    });

    if (!post) return { error: "" };

    const seller = await db.user.findUnique({
      where: { id: post.userId },
      select: { id: true },
    });

    if (!seller) return { error: "" };

    await db.contactus.create({
      data: {
        name,
        email,
        phoneNumber,
        message,
        // messageTo: { connect: { id: seller.id } },
        // messageTo: seller.id,
        post: { connect: { id: post.id } },
      },
    });
  }
  return { name: "200" };
};
