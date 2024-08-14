"use client";

import { deactivatePostStatus } from "@/actions/post.action";
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
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Post = {
  slug: string;
  property_id: string;
  title: string;
  area: number;
  photo: string;
  property_for: "sale" | "rent";
  property_type: "residential" | "commercial";
  status: boolean;
};
export const columns: ColumnDef<Post>[] = [
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
            src={row.getValue("photo")}
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
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <MoreColumns row={row} />;
    },
  },
];

export default function MoreColumns({ row }: { row: Row<Post> }) {
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
        <Link href={`/user/post/edit/${row.original.slug}`}>
          <DropdownMenuItem className="hover:bg-accent cursor-pointer">
            Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:bg-red-800 hover:text-white cursor-pointer"
          asChild
        >
          <Alert
            description="Are you sure you want to deactivate this post?"
            onContinue={async () => {
              const returnValue = await deactivatePostStatus(row.original.slug);
              if (returnValue) {
                toast({
                  title: returnValue.message[0] || "Something Went Wrong",
                  description: "This will reflect to everybody",
                });
              }
            }}
            buttonText="Deactive"
          >
            <p className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:bg-red-800 hover:text-white cursor-pointer">
              Deactive
            </p>
          </Alert>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
