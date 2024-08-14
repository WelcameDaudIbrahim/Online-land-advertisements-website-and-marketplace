"use server";

import db from "@/db/db";
import { logInSchema, signUpSchema } from "@/zodSchema/authSchema";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_REDIRECT_AFTER_LOGIN } from "@/routes";
import { revalidatePath } from "next/cache";
import { sendVerification } from "./user.action";

export const login = async (prevState: unknown, formData: FormData) => {
  const result = logInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, error: "" };
  }

  const { email, password } = result.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT_AFTER_LOGIN,
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
  redirect(DEFAULT_REDIRECT_AFTER_LOGIN);
};

export const sign_out = async (url: string = "") => {
  "use server";
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
    return { error: "Something Went Wrong" };
  }

  return redirect(DEFAULT_REDIRECT_AFTER_LOGIN);
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });

  return user;
};

export const getUserByEmail = async (
  email: string,
  args?: Omit<Prisma.UserFindUniqueArgs, "where">
) => {
  try {
    const user = await db.user.findUnique({ where: { email }, ...args });

    return user;
  } catch {
    return null;
  }
};
