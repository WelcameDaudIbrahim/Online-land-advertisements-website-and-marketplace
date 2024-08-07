"use client";
import { login } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
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
import { logInSchema } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { PiEyeClosedThin, PiEyeThin } from "react-icons/pi";
import { z } from "zod";

export default function Page() {
  const [state, action] = useFormState(login, null);

  const form = useForm<z.infer<typeof logInSchema>>({
    resolver: zodResolver(logInSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-row">
      <Image
        src="/assets/login.png"
        height={1000}
        width={1000}
        alt="Login Image"
        className="!h-[100vh] w-[50%] "
      />
      <div className="flex flex-col  h-[100vh] w-[50%] px-16 justify-center">
        <Image
          src="/assets/logo.png"
          width={120}
          height={33}
          alt="logo"
          className="mx-auto pt-8"
        />
        <div className="flex items-center gap-2 flex-col my-auto max-w-[432px] md:min-w-[432px] mx-auto">
          <h1 className="mb-4 text-center text-primary text-5xl font-bold font-roboto leading-[57.60px]">
            Log in
          </h1>
          <Button className="rounded-none w-full text-base font-normal font-roboto text-red-500 hover:bg-red-500 hover:text-white bg-transparent border-2 border-red-500 leading-normal active:bg-red-600">
            <FaGoogle className="mr-1.5 size-4" />
            Log in with Google
          </Button>
          <Button className="rounded-none w-full text-base font-normal font-roboto text-indigo-700 hover:bg-indigo-700 hover:text-white bg-transparent border-2 border-indigo-700 leading-normal active:bg-indigo-800">
            <FaFacebookF className="mr-1.5 size-4" /> Log in with Facebook
          </Button>
          {state && state.error && (
            <p className="text-red-600 text-lg font-medium tracking-wide font-roboto">
              {state.error}
            </p>
          )}
          <div className="border-[0.6px] my-3.5 border-stone-400 w-full h-0"></div>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2.5">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative w-full m-0 mt-3.5 p-0">
                        <Input
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
                        <Link
                          className="absolute top-[-80%] right-0 text-blue-900 hover:text-blue-950"
                          href="/"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p></p>
              <SubmitButton className="w-full text-white mt-1.5 text-base font-normal font-roboto leading-[27px] tracking-wide rounded-none">
                Log In
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
        <div className="text-left text-black text-sm font-normal font-roboto leading-[21px] w-full py-8">
          {COPYRIGHT_TEXT}
        </div>
      </div>
    </div>
  );
}
