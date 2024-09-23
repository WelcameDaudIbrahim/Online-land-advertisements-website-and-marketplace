import React from "react";
import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegEye } from "react-icons/fa6";
import { FullPagination } from "@/components/ui/pagination";
import { auth } from "@/auth";
import NotFound from "@/app/not-found";
import { GoArrowRight } from "react-icons/go";

export const metadata: Metadata = {
  title: "Messages",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const user = await auth();

  if (!user) return NotFound();

  const take = Number(searchParams?.take) || 10;
  const page = Number(searchParams?.page) || 1;

  const contacts = await db.contactus.findMany({
    where: { messageTo: user.user.id },
    orderBy: { created_at: "desc" },
    take,
    skip: (page - 1) * take,
    include: { post: true },
  });

  const totalCount = await db.contactus.count();
  const totalPages = Math.ceil(totalCount / take);
  return (
    <div>
      <h1 className="text-black font-roboto text-3xl mb-3 font-medium tracking-wide">
        Messages
      </h1>
      <div className="mx-2.5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                className={contact.isRead ? "bg-muted/80" : undefined}
                key={contact.id}
              >
                <TableCell className="font-medium">{contact.id}</TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>
                  {contact.message.length > 8
                    ? `${contact.message.substring(0, 8)}...`
                    : contact.message}
                </TableCell>
                <TableCell>
                  <Link href={`/post/${contact.post?.id}`}>
                    <Button variant="ghost">
                      <GoArrowRight className="size-6 text-gray-600" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell
                  className={`text-${
                    contact.status === "Pending" ? "yellow-500" : "green-500"
                  } font-bold`}
                >
                  {contact.status}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/user/messages/${contact.id}`}>
                    <Button variant="ghost">
                      <FaRegEye className="size-6 text-gray-600" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full flex py-1.5 px-3.5 items-center justify-between">
          <FullPagination
            currentPage={page}
            totalPages={totalPages}
            take={take}
          />
        </div>
      </div>
    </div>
  );
}
