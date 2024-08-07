"use client";
import { updateSettings } from "@/actions/user.action";
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
import useAuth from "@/hooks/useAuth";
import { settingsSchema } from "@/zodSchema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

export default function Page() {
  const [state, action] = useFormState(updateSettings, null);

  if (state?.error === "200") {
    window.location.reload();
  }

  const user = useAuth();

  const form = useForm<Zod.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const name = form.watch("name");
  const email = form.watch("email");

  return (
    <div className="w-full flex items-start flex-col">
      <h1 className="text-black font-roboto text-3xl mb-3 font-medium tracking-wide">
        Settings
      </h1>{" "}
      <Form {...form}>
        <form
          action={action}
          className="flex gap-y-2.5 py-2.5 px-3.5 w-full flex-col"
        >
          {state && state.error && (
            <p className="text-red-600 text-lg font-medium tracking-wide font-roboto">
              {state.error}
            </p>
          )}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
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
          <SubmitButton
            disabled={name === user?.name && email === user?.email && true}
            className="mt-1.5 active:bg-emerald-50 active:bg-opacity-70"
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
