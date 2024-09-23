"use client";
import { signup } from "@/actions/auth.action";
import Social from "@/app/(auth)/_components/Social";
import Track from "@/components/track/Track";
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
import { signUpSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { PiEyeClosedThin, PiEyeThin } from "react-icons/pi";
import { z } from "zod";

export default function SignUp() {
  const [state, action] = useFormState(signup, null);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  if (state && state.error === "200") {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="relative flex items-center justify-center overflow-hidden w-full h-[100vh]">
      <Image
        src="/assets/signup.png"
        width={1400}
        height={1000}
        quality={40}
        alt="Sign Up Image"
        className="w-full h-auto -z-20 object-contain absolute overflow-hidden"
        priority
      />

      <Track />

      <div className="absolute w-full h-[100vh] top-0 left-0 m-0 p-0 bg-[#12664FCC] -z-10"></div>
      <div className="flex flex-col max-h-[919px]  h-full w-full md:h-auto relative md:w-[60%] px-4 md:px-16 justify-center bg-white max-w-[600px] rounded shadow">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            width={120}
            height={33}
            alt="logo"
            className="mx-auto pt-4 pb-5 hidden md:block"
          />
        </Link>
        <div className="flex items-center gap-2 flex-col my-auto max-w-[432px] md:min-w-[432px] mx-auto">
          <h1 className="mb-1 text-center text-primary text-5xl font-bold font-roboto leading-[57.60px]">
            Sign Up
          </h1>
          <Social text="Sign up" />
          {state && state.error && (
            <p className="text-red-600 text-lg font-medium tracking-wide font-roboto">
              {state.error}
            </p>
          )}
          <div className="border-[0.6px] mt-1.5 mb-0.5 border-stone-400 w-full h-0"></div>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={true}
                        autoComplete="name"
                        type="text"
                        placeholder="Your Name"
                        className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-2.5">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2.5">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full m-0 mt-2.5 p-0">
                        <Input
                          autoComplete="new-password"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Password"
                          className="p-3 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                          {...field}
                        />
                        <div
                          className="flex items-center justify-center aspect-square absolute top-0 right-4 cursor-pointer h-full"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          {isPasswordVisible ? (
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
                      <div className="relative w-full m-0 mt-2.5 p-0">
                        <Input
                          autoComplete="new-password"
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
                Sign Up
              </SubmitButton>
            </form>
          </Form>
          <p className="text-sm tracking-wide w-full px-0 py-0.5">
            By clicking &quot;SIGN UP&quot; I agree to{" "}
            <Link href="/terms-conditions" className="text-primary">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary">
              Privacy Policy
            </Link>
          </p>
          <p className="p-1.5">
            Already have an account?{" "}
            <span className="text-primary underline">
              <Link href="/log-in">Log In</Link>
            </span>
          </p>
        </div>
        <div className="text-left text-black text-sm font-normal font-roboto leading-[21px] w-full mb-4 mt-1">
          {COPYRIGHT_TEXT}
        </div>
      </div>
      <Suspense fallback={<></>}>
        <Track />
      </Suspense>
    </div>
  );
}
