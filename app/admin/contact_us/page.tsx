import { AdminBox, AdminHeader } from "@/components/admin/layout/Utils";
import React from "react";
import AdminCreatePostButton from "../_components/AdminBackButton copy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import db from "@/db/db";
import { FullPagination } from "@/components/ui/pagination";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contacts",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const take = Number(searchParams?.take) || 10;
  const page = Number(searchParams?.page) || 1;

  const contacts = await db.contactus.findMany({
    orderBy: { created_at: "desc" },
    take,
    skip: (page - 1) * take,
  });

  const totalCount = await db.contactus.count();
  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="w-full flex flex-wrap ">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4 mx-4">
        <AdminHeader>Contacts</AdminHeader>
        <AdminCreatePostButton />
      </div>
      <AdminBox className="mx-3.5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Tp</TableHead>
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
                <TableCell>{contact.subject}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {contact.message.length > 8
                    ? `${contact.message.substring(0, 8)}...`
                    : contact.message}
                </TableCell>
                <TableCell>{contact.messageTo ? "User" : "Admin"}</TableCell>
                <TableCell
                  className={`text-${
                    contact.status === "Pending" ? "yellow-500" : "green-500"
                  } font-bold`}
                >
                  {contact.status}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/contact_us/${contact.id}`}>
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
      </AdminBox>
    </div>
  );
}
