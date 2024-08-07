import { z } from "zod";

export const logInSchema = z.object({
  email: z
    .string({ message: "E-mail is required" })
    .email({ message: "Please Enter A Valid E-mail" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password Must Be 8 Character Long" })
    .max(55, { message: "Password Cannot Be Longer Than 255 Character" }),
});

export const signUpSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(3, { message: "Name Must Be 3 Character Long" })
      .max(255, { message: "Name Cannot Be Longer Than 255 Character" }),
    email: z
      .string({ message: "E-mail is required" })
      .email({ message: "Please Enter A Valid E-mail" }),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password Must Be 8 Character Long" })
      .max(55, { message: "Password Cannot Be Longer Than 255 Character" }),
    confirmPassword: z.string({ message: "Confirm Password is required" }),
  })
  .refine(
    (data) =>
      !!data.password.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      ),
    {
      message: `Must have at least one numeric character\nMust have at least one lowercase character\nMust have at least one uppercase character
        Must have at least one special symbol among !@#$%^&*()+=[]{};:<>,.?|\\~`,
      path: ["password"],
    }
  )
  .refine((data) => !!(data.password === data.confirmPassword), {
    message: "Password And Confirm Password Does Not Match.",
    path: ["confirmPassword"],
  });
