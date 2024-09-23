import { AdminBox, AdminHeader } from "@/components/admin/layout/Utils";
import React from "react";
import db from "@/db/db";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { auth } from "@/auth";
import ContactUsStatus from "@/app/admin/_components/ContactUsStatus";

export const metadata: Metadata = {
  title: "Messages",
};
export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;

  const user = await auth();

  if (!user) return notFound();

  const data = await db.contactus.findUnique({
    where: {
      id: Number(id),
      messageTo: user.user.id,
    },
    include: {
      post: true,
    },
  });

  if (!data) return notFound();

  if (!data.isRead) {
    await db.contactus.update({
      where: {
        id: Number(id),
        messageTo: user.user.id,
      },
      data: {
        isRead: true,
      },
    });
  }
  revalidatePath(`/admin/contact_us`);

  return (
    <div>
      <h1 className="text-black font-roboto text-3xl mb-3 font-medium tracking-wide">
        Messages
      </h1>
      <div className="mx-2.5">
        <p>
          <span className="font-bold text-primary mt-1.5">Name: </span>
          {data.name}
        </p>
        <p>
          <span className="font-bold text-primary mt-1.5">Email: </span>
          {data.email}
        </p>
        {data.phoneNumber && (
          <p>
            <span className="font-bold text-primary mt-1.5">
              Phone Number: +88 {!data.phoneNumber.startsWith("0") && "0"}{" "}
            </span>
            {data.phoneNumber}
          </p>
        )}
        <p>
          <span className="font-bold text-primary mt-1.5">Message: </span>
          {data.message}
        </p>
        {data.post && (
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-primary mt-1.5">View Post: </span>
            <Link href={`/post/${data.post.slug}`} target="_blank">
              <Button variant="ghost">
                <GoArrowRight className="size-6 text-gray-600" />
              </Button>
            </Link>
          </div>
        )}
        <p>
          <span className="font-bold text-primary mt-1.5">Status: </span>
          <span
            className={`${data.status === "Pending" ? "text-yellow-500" : ""} ${
              data.status === "Done" ? "text-green-500" : ""
            } font-bold`}
          >
            {data.status}
          </span>
        </p>
        <p>
          <span className="font-bold text-primary mt-1.5">Sended At: </span>
          {data.created_at.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </p>
        <p>
          <span className="font-bold text-primary mt-1.5">Is Read: </span>
          {data.isRead ? "Yes" : "No"}
        </p>
        <div className="flex justify-start items-cente mt-2.5 gap-1.5 w-full">
          <span className="font-bold text-primary mt-1.5">Change Status: </span>
          <ContactUsStatus status={data.status} id={data.id} />
        </div>
      </div>
    </div>
  );
}
