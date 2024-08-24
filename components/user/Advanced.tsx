"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
} from "../ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuth from "@/hooks/useAuth";
import { useFormState } from "react-dom";
import { changeAvatar, changePassword } from "@/actions/user.action";
import { avatarSchema, changePasswordSchema } from "@/zodSchema/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiEyeClosedThin, PiEyeThin } from "react-icons/pi";
import { Input } from "../ui/input";
import { IMAGES_PATH_PREFIX } from "@/routes";

export function AvatarChange() {
  const user = useAuth();

  const [avatarSrc, setAvatarSrc] = useState(
    user?.image
      ? user.image.startsWith("https://")
        ? user?.image
        : IMAGES_PATH_PREFIX + user?.image
      : "/assets/profile.png"
  );
  const [state, action] = useFormState(changeAvatar, null);

  const form = useForm<Zod.infer<typeof avatarSchema>>({
    resolver: zodResolver(avatarSchema),
    mode: "onChange",
  });

  if (state?.avatar) {
    if (state?.avatar[0] === "200") {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }

  // const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="w-full items-center justify-start gap-x-1 px-3.5 py-2.5 flex">
      <Avatar className="size-20">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>BL</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-black font-medium ml-3 tracking-wide text-2xl">
          {user?.name}
        </p>
        <Form {...form}>
          <form action={action}>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="mt-2.5">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden opacity-0"
                    {...form.register("avatar")}
                    onChange={(e) => {
                      const files = e.target.files;

                      if (files) {
                        const [file] = Array.from(files);

                        if (file) {
                          setAvatarSrc(URL.createObjectURL(file));
                        }
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <label
              htmlFor="avatar"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 tracking-wider mt-0.5 cursor-pointer"
            >
              Change Avatar
            </label>
            {avatarSrc !== user?.image &&
              avatarSrc !== "/assets/profile.png" && (
                <SubmitButton className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#008000] hover:text-white h-9 rounded-md px-3 tracking-wider mt-0.5 cursor-pointer bg-transparent text-[#008000]">
                  ✔ Update
                </SubmitButton>
              )}
            {state?.avatar &&
              state?.avatar.map((message) => (
                <p
                  className="text-red-600 text-base font-medium tracking-wide font-roboto ml-3.5"
                  key={message}
                >
                  * {message}
                </p>
              ))}
          </form>
        </Form>
      </div>
    </div>
  );
}

export function PasswordChange() {
  const [state, action] = useFormState(changePassword, null);

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<Zod.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (
      state &&
      state?.currentPassword &&
      state?.currentPassword[0] === "Password Changed Successfully"
    ) {
      form.reset();
    }
    if (state?.currentPassword !== undefined) {
      form.setError("currentPassword", {
        type: "value",
        message: state?.currentPassword?.at(0) || "",
      });
    }
    if (state?.newPassword !== undefined) {
      form.setError("newPassword", {
        type: "value",
        message: state?.newPassword?.at(0) || "",
      });
    }
    if (state?.confirmPassword !== undefined) {
      form.setError("confirmPassword", {
        type: "value",
        message: state?.confirmPassword?.at(0) || "",
      });
    }
  }, [
    form,
    state,
    state?.currentPassword,
    state?.newPassword,
    state?.confirmPassword,
  ]);
  return (
    <div className="mt-6">
      <h2 className="text-black text-2xl font-medium tracking-wider font-roboto">
        Change Password
      </h2>
      <Form {...form}>
        <form
          action={action}
          className="flex gap-y-0 py-2.5 px-3.5 w-full flex-col"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="mt-2.5">
                <FormLabel
                  className={`${
                    form.formState.errors.currentPassword?.message ===
                      "Password Changed Successfully" && "text-green-600"
                  }`}
                >
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative w-full m-0 mt-2.5 p-0">
                    <Input
                      type={isCurrentPasswordVisible ? "text" : "password"}
                      placeholder="Your Current Password"
                      className="py-1.5 px-3.5 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-sm font-normal font-roboto leading-normal h-auto"
                      {...field}
                    />
                    <div
                      className="flex items-center justify-center aspect-square absolute top-0 right-2.5 cursor-pointer h-full"
                      onClick={() =>
                        setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                      }
                    >
                      {isCurrentPasswordVisible ? (
                        <PiEyeThin className="size-6 text-stone-500" />
                      ) : (
                        <PiEyeClosedThin className="size-6 text-stone-500" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage
                  className={`${
                    form.formState.errors.currentPassword?.message ===
                      "Password Changed Successfully" && "text-green-600"
                  }`}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="mt-2.5">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative w-full m-0 mt-2.5 p-0">
                    <Input
                      type={isNewPasswordVisible ? "text" : "password"}
                      placeholder="Your New Password"
                      className="py-1.5 px-3.5 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-sm font-normal font-roboto leading-normal h-auto"
                      {...field}
                    />
                    <div
                      className="flex items-center justify-center aspect-square absolute top-0 right-2.5 cursor-pointer h-full"
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                    >
                      {isNewPasswordVisible ? (
                        <PiEyeThin className="size-6 text-stone-500" />
                      ) : (
                        <PiEyeClosedThin className="size-6 text-stone-500" />
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
                  <div className="relative w-full m-0 p-0">
                    <Input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Your Confirm Password"
                      className="py-1.5 px-3.5 border-2 border-stone-300 rounded-sm w-full placeholder-stone-500 text-black text-sm font-normal font-roboto leading-normal h-auto"
                      {...field}
                    />
                    <div
                      className="flex items-center justify-center aspect-square absolute top-0 right-2.5 cursor-pointer h-full"
                      onClick={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      {isConfirmPasswordVisible ? (
                        <PiEyeThin className="size-6 text-stone-500" />
                      ) : (
                        <PiEyeClosedThin className="size-6 text-stone-500" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton className="mt-4 active:bg-emerald-50 active:bg-opacity-70">
            Change Password
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}

export default function Advanced() {
  return (
    <>
      <AvatarChange />
      <PasswordChange />
    </>
  );
}
