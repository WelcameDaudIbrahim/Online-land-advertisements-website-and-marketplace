import {
  AdminBox,
  AdminButton,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import { columns } from "./columns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import db from "@/db/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { DataTable } from "./data-table";

export default async function DemoPage() {
  const user = await auth();

  if (!user) return notFound();

  const data = await db.post.findMany({
    where: { userId: user.user.id },
    select: {
      slug: true,
      title: true,
      photo: true,
      area: true,
      property_for: true,
      property_type: true,
      property_id: true,
      status: true,
    },
  });
  return (
    <div className="px-3.5">
      <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
        My Posts
      </h1>
      <div className="container mx-auto px-1.5 py-2.5">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="w-full flex py-1.5 px-3.5 items-center justify-between">
        <div></div>
        <div></div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
