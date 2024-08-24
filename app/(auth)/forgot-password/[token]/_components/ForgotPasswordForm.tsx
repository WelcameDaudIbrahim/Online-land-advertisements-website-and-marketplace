"use client";
import { forgotPasswordChange } from "@/actions/auth.action";
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
import { changeForgotPassword } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { PiEyeClosedThin, PiEyeThin } from "react-icons/pi";
import { z } from "zod";

export default function ForgotPasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState(
    forgotPasswordChange.bind(null, token),
    null
  );

  const form = useForm<z.infer<typeof changeForgotPassword>>({
    resolver: zodResolver(changeForgotPassword),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const formRef = useRef<HTMLFormElement>(null);

  if (state && state.error === "200") {
    if (typeof window !== "undefined") {
      window.location.replace("/log-in");
    }
  }
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  return (
    <div className="flex flex-row w-full overflow-hidden h-[100vh]">
      <Image
        src="/assets/login.png"
        height={1000}
        width={1000}
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
            Change Password
          </h1>

          {state && state.error && (
            <p
              className={`${
                state && state.error === "200"
                  ? "text-green-600"
                  : "text-red-600"
              } text-lg font-medium tracking-wide font-roboto`}
            >
              {state.error}
            </p>
          )}
          <Form {...form}>
            <form action={action} className="w-full" ref={formRef}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2.5">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full m-0 mt-3.5 p-0">
                        <Input
                          type={isNewPasswordVisible ? "text" : "password"}
                          placeholder="New Password"
                          className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                          {...field}
                        />
                        <div
                          className="flex items-center justify-center aspect-square absolute top-0 right-4 cursor-pointer h-full"
                          onClick={() =>
                            setIsNewPasswordVisible(!isNewPasswordVisible)
                          }
                        >
                          {isNewPasswordVisible ? (
                            <PiEyeThin className="size-7 text-stone-500" />
                          ) : (
                            <PiEyeClosedThin className="size-7 text-stone-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-2.5">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full m-0 mt-3.5 p-0">
                        <Input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                          {...field}
                        />
                        <div
                          className="flex items-center justify-center aspect-square absolute top-0 right-4 cursor-pointer h-full"
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible
                            )
                          }
                        >
                          {isConfirmPasswordVisible ? (
                            <PiEyeThin className="size-7 text-stone-500" />
                          ) : (
                            <PiEyeClosedThin className="size-7 text-stone-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton className="w-full text-white mt-1.5 text-base font-normal font-roboto leading-[27px] tracking-wide rounded-none">
                Change Password
              </SubmitButton>
            </form>
          </Form>
          <p className="p-1.5">
            Already have an account?{" "}
            <span className="text-primary underline">
              <Link href="/log-in">Log In</Link>
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
