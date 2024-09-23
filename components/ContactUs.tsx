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
import { contactUsSchema } from "@/zodSchema/userSchema";
import { Textarea } from "@/components/ui/textarea";
import { TiLocation } from "react-icons/ti";
import { useFormState } from "react-dom";
import { sendContactUs } from "@/actions/auth.action";
import { toast } from "@/components/ui/use-toast";

export default function ContactUs() {
  const [state, action] = useFormState(
    sendContactUs.bind(null, undefined),
    null
  );

  if (state && state?.name === "200") {
    toast({
      title: "Thank you for your message!",
      description: "We will get back to you as soon as possible.",
    });
  }
  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl text text-center font-bold tracking-wider text-primary">
        Contact Us
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 mx-12">
        <div className="w-full">
          <div className="p-8">
            <h2 className="text-xl text text-center font-bold tracking-wider text-black">
              Send Us Message
            </h2>
            <div className="w-full">
              <Form {...form}>
                <form
                  className="grid grid-cols-2 mt-2.5 px-1.5 gap-2.5"
                  action={action}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
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
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Message*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SubmitButton className="w-full col-span-2">
                    Send Message
                  </SubmitButton>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="text-black text-lg font-bold font-roboto tracking-wide mt-8 mb-2.5 mx-3.5 leading-normal">
            Contacts
          </div>
          <div className="h-[142px] flex-col justify-start items-start gap-3 flex ml-8">
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                123 Freshie Lane, Farmville, USA
              </div>
            </div>
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                +1-800-373-7443
                <br />
                +23-800-373-7443
              </div>
            </div>
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                support@bdlord.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
