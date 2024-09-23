"use client";
import { forgotPasswordEmailSent } from "@/actions/auth.action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { COPYRIGHT_TEXT } from "@/data/layout";
import { forgotEmailSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ForgotPassword() {
  const [state, action] = useFormState(forgotPasswordEmailSent, null);

  const form = useForm<z.infer<typeof forgotEmailSchema>>({
    resolver: zodResolver(forgotEmailSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-row w-full overflow-hidden h-[100vh]">
      <Image
        src="/assets/footer.jpg"
        height={1000}
        width={1000}
        quality={20}
        alt="Login Image"
        className="!h-[100vh] w-full md:w-[50%] absolute blur-2xl opacity-35 object-cover md:opacity-100 -z-10 md:blur-0 md:relative"
        priority
      />
      <div className="flex flex-col h-[100vh] w-full md:w-[50%] px--16 justify-center">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            width={120}
            height={33}
            alt="logo"
            className="mx-auto pt-8"
          />
        </Link>
        <div className="flex items-center gap-2 flex-col my-auto w-[94%] sm:w-[86%] md:max-w-[432px] md:min-w-[432px] mx-auto">
          <h1 className="mb-4 text-center text-primary text-5xl font-bold font-roboto leading-[57.60px]">
            Forgot Password
          </h1>

          {state && state.error && (
            <p
              className={`${
                state && state.error === "Reset Password Email Has Sent."
                  ? "text-green-600"
                  : "text-red-600"
              } text-lg font-medium tracking-wide font-roboto`}
            >
              {state.error}
            </p>
          )}
          <Form {...form}>
            <form
              action={action}
              className="w-full"
              ref={formRef}
              // onSubmit={form.handleSubmit((_, e) => {
              //   e?.preventDefault();
              //   formRef?.current?.submit();
              // })}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton className="w-full text-white mt-1.5 text-base font-normal font-roboto leading-[27px] tracking-wide rounded-none">
                Sent Email
              </SubmitButton>
            </form>
          </Form>
          <p className="p-4">
            New Here?{" "}
            <span className="text-primary underline">
              <Link href="/sign-up">Sign Up</Link>
            </span>
          </p>
        </div>
        <div className="text-left px-1.5 sm:px-4 md:px-21 text-black text-sm font-normal font-roboto leading-[21px] w-full py-8">
          {COPYRIGHT_TEXT}
        </div>
      </div>
    </div>
  );
}
