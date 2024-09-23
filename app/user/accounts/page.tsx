import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "My Account",
};
export default async function Page() {
  const user = await auth();
  if (!user) return notFound();
  return (
    <div>
      <h1 className="text-black font-roboto text-3xl mb-3 font-medium tracking-wide">
        My Accounts
      </h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium tracking-wide">Name</TableCell>
            <TableCell>{user?.user.name}</TableCell>
            <TableCell className="text-right">
              <Link href="/user/settings">
                <Button variant="ghost">Update</Button>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium tracking-wide">Email</TableCell>
            <TableCell>{user?.user.email}</TableCell>
            <TableCell className="text-right">
              <Link href="/user/settings">
                <Button variant="ghost">Update</Button>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium tracking-wide">Status</TableCell>
            <TableCell>
              {user?.user.emailVerified ? (
                <p className="text-base font-roboto tracking-wide text-emerald-800">
                  Verified
                </p>
              ) : (
                (
                  <p className="text-base font-roboto tracking-wide text-red-800">
                    Not Verified
                  </p>
                )!
              )}
            </TableCell>
            <TableCell className="text-right">
              <Link href="/user/settings">
                <Button variant="ghost">Change Email</Button>
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
