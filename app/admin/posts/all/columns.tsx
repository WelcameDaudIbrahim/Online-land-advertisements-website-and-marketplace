"use client";

import { deletePost, updatePostStatus } from "@/actions/post.action";
import { Alert } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { UpdateQuery } from "@/lib/utils";
import { IMAGES_PATH_PREFIX } from "@/routes";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type Post = {
  id: number;
  userId: string;
  property_id: string;
  title: string;
  area: number;
  photo: string;
  property_for: "sale" | "rent";
  property_type: "residential" | "commercial";
  pending: boolean;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "property_id",
    header: "Property Id",
    cell: ({ row }) => {
      const property_id = row.getValue("property_id");
      if (typeof property_id === "string") {
        const last_text = property_id.length > 8 && "...";
        return (
          <div>
            {property_id.substring(0, 8)}
            {last_text}
          </div>
        );
      }
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title");
      if (typeof title === "string") {
        const last_text = title.length > 14 && "...";
        return (
          <div>
            {title.substring(0, 14)}
            {last_text}
          </div>
        );
      }
    },
  },
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      return (
        <div>
          <Image
            src={IMAGES_PATH_PREFIX + row.getValue("photo")}
            width={100}
            height={100}
            className="object-contain"
            quality={10}
            alt="Image"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "area",
    header: "Area (Sqft)",
  },
  {
    accessorKey: "property_for",
    header: "Property For",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("property_for")}</div>;
    },
  },
  {
    accessorKey: "property_type",
    header: "Property Type",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("property_type")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("status");

      return (
        <div>
          {status === false ? (
            <p className="font-medium text-red-600">Inactive</p>
          ) : (
            <p className="font-medium text-green-600">Active</p>
          )}
          <p>{!row.original.pending && "Not"} Requested For Approval</p>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const created_at: Date = row.getValue("created_at");

      return (
        <div className="text-right">
          {created_at.toLocaleDateString("en-US")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // if (!id || !status) return null;
      return <MoreColumns row={row} />;
    },
  },
];

export default function MoreColumns({ row }: { row: Row<Post> }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = row.getValue("id");
  const status = row.getValue("status");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/admin/posts/edit/${row.getValue("id")}`}>
          <DropdownMenuItem className="hover:bg-accent cursor-pointer">
            Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="hover:bg-accent cursor-pointer" asChild>
          <Alert
            description="Are you sure you want to update post status? And it will reflect to all the users."
            onContinue={async () => {
              const returnValue = await updatePostStatus(
                Number(id),
                !Boolean(status),
                "/admin/posts/all"
              );
              if (returnValue) {
                toast({
                  title: "Post Status Updated Successfully",
                  description: "This might reflect to all the users.",
                });
              }
            }}
          >
            <p className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent cursor-pointer">
              {status ? "Deactive" : "Activate"}
            </p>
          </Alert>
        </DropdownMenuItem>
        <Link
          href={UpdateQuery(
            [{ field: "userId", value: row.original.userId }],
            searchParams,
            pathname
          )}
        >
          <DropdownMenuItem className="hover:bg-accent cursor-pointer">
            More Posts From User
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:bg-red-800 hover:text-white cursor-pointer"
          asChild
        >
          <Alert
            description="Are you sure you want to delete post? And it will reflect to all the users.This action cannot be undone."
            onContinue={async () => {
              const returnValue = await deletePost(Number(id));
              if (returnValue) {
                toast({
                  title: returnValue.title[0] || "Something Went Wrong",
                  description: "This will reflect to all the users.",
                });
              }
            }}
            buttonText="Delete"
          >
            <p className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:bg-red-800 hover:text-white cursor-pointer">
              Delete
            </p>
          </Alert>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
