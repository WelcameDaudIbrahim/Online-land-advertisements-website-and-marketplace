import { z } from "zod";
import { allowed_file_types } from "./postSchema";

export const settingsSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name Must Be 3 Character Long" })
    .max(255, { message: "Name Cannot Be Longer Than 255 Character" }),
  email: z
    .string({ message: "E-mail is required" })
    .email({ message: "Please Enter A Valid E-mail" }),
});

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File, {
      message: "Please Upload A Valid File",
    })
    .refine((file) => allowed_file_types.includes(file.type), {
      message: "Only JPEG, JPG And PNG Are Allowed.",
      path: ["avatar"],
    })
    .refine((file) => file.size <= 1024 * 1024, {
      message: "You Can't upload More Than 1 MB",
      path: ["avatar"],
    }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current Password is required" })
      .min(8, { message: "Current Password Must Be 8 Character Long" })
      .max(55, {
        message: "Current Password Cannot Be Longer Than 255 Character",
      }),

    newPassword: z
      .string({ message: "New Password is required" })
      .min(8, { message: "New Password Must Be 8 Character Long" })
      .max(55, { message: "New Password Cannot Be Longer Than 255 Character" }),

    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(8, { message: "New Password Must Be 8 Character Long" })
      .max(55, { message: "New Password Cannot Be Longer Than 255 Character" }),
  })
  .refine(
    (data) =>
      !!data.newPassword.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      ),
    {
      message: `Must have at least one numeric character\nMust have at least one lowercase character\nMust have at least one uppercase character
        Must have at least one special symbol among !@#$%^&*()+=[]{};:<>,.?|\\~`,
      path: ["newPassword"],
    }
  )
  .refine((data) => !!(data.newPassword === data.confirmPassword), {
    message: "New Password And Confirm Password Does Not Match.",
    path: ["confirmPassword"],
  });
