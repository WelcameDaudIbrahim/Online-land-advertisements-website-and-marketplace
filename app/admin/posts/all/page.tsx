import {
  AdminBox,
  AdminButton,
  AdminHeader,
} from "@/components/admin/layout/Utils";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getPosts } from "@/actions/post.action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function DemoPage() {
  const data = await getPosts();
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4">
        <AdminHeader>All Post</AdminHeader>
        <AdminButton>Back</AdminButton>
      </div>
      <AdminBox>
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
      </AdminBox>
    </div>
  );
}
