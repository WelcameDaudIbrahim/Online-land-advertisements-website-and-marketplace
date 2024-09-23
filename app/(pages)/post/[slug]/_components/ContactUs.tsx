"use client";
import React from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactToSellerSchema } from "@/zodSchema/userSchema";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "react-dom";
import { sendContactUs } from "@/actions/auth.action";
import { toast } from "@/components/ui/use-toast";

export default function ContactUs({ post_id }: { post_id: number }) {
  const [state, action] = useFormState(sendContactUs.bind(null, post_id), null);

  if (state && state?.name === "200") {
    toast({
      title: "Thank you for your message!",
      description: "We will get back to you as soon as possible.",
    });
  }
  const form = useForm<z.infer<typeof contactToSellerSchema>>({
    resolver: zodResolver(contactToSellerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  return (
    <div className="w-full">
      <div className="w-full">
        <h2 className="text-xl text text-center font-bold tracking-wider text-black">
          Send Us Message To Seller
        </h2>
        <div className="w-full">
          <Form {...form}>
            <form
              className="flex flex-col items-center w-full mt-2.5 px-0.5 gap-1.5"
              action={action}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone Number For This Post</FormLabel>
                    <FormControl>
                      <div className="flex items-start justify-center w-full">
                        <Input
                          type="text"
                          placeholder="+88"
                          className="p-3 w-[56px] ml-0.5 border-2 opacity-100 flex-shrink border-stone-300 rounded-sm placeholder-black text-black text-base font-normal font-roboto leading-normal"
                          disabled
                        />
                        <Input
                          type="text"
                          placeholder="Phone Number"
                          className="p-3 border-2 border-stone-300 flex-grow rounded-sm w-full placeholder-stone-500 text-black text-base font-normal font-roboto leading-normal"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Message*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton className="w-full ">Send Message</SubmitButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
