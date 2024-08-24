import { AdminBox, AdminHeader } from "@/components/admin/layout/Utils";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getPosts } from "@/actions/post.action";
import { FullPagination } from "@/components/ui/pagination";
import AdminBackButton from "../../_components/AdminBackButton";
import Link from "next/link";
import db from "@/db/db";
import PostSearch from "@/components/ui/table-search";
import { $Enums } from "@prisma/client";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const isTrash = !!searchParams?.trash;
  const take = Number(searchParams?.take) || 10;
  const page = Number(searchParams?.page) || 1;
  const bathroomNumberParams = searchParams?.bathroom;
  const bedroomNumberParams = searchParams?.bedroom;
  const propertyTypeParams = searchParams?.type;
  const propertyForParams = searchParams?.for;
  const minAreaParams = searchParams?.minArea;
  const maxAreaParams = searchParams?.maxArea;
  const searchQuery = searchParams?.search;
  const userId = searchParams?.userId;
  const total_page = (await db.post.count()) / take;

  const data = await getPosts({
    deletedPost: isTrash,
    search: searchQuery || "",
    take,
    page,
    propertyType:
      propertyTypeParams !== null
        ? ["residential", "commercial"].includes(
            propertyTypeParams?.toLowerCase() || ""
          )
          ? (propertyTypeParams as $Enums.PropertyType)
          : undefined
        : undefined,
    propertyFor:
      propertyForParams !== null
        ? ["sale", "rent"].includes(propertyForParams?.toLowerCase() || "")
          ? (propertyForParams as $Enums.PropertyFor)
          : undefined
        : undefined,
    minAreaNumber: Number(minAreaParams) || undefined,
    maxAreaNumber: Number(maxAreaParams) || undefined,
    bathroomNumber: Number(bathroomNumberParams) || 0,
    bedroomNumber: Number(bedroomNumberParams) || 0,
    user_id: userId || undefined,
  });

  const trashCount = await db.deletedPost.count();
  return (
    <div className="px-3.5">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4">
        <AdminHeader>{isTrash ? "All Trash Post 😁" : "All Post"}</AdminHeader>
        <AdminBackButton />
      </div>
      <AdminBox>
        <div className="flex items-start px-3.5 py-0.5 justify-between mt-2.5">
          <Link
            href="/admin/posts/all?trash=true"
            className="text-secondary font-roboto font-medium text-base"
          >
            Statistics
          </Link>
          <Link
            href="/admin/posts/all?trash=true"
            className="text-red-800 font-roboto font-medium text-base"
          >
            All Trash ({trashCount})
          </Link>
        </div>
        <div className="w-full mb-1 mt-3.5">
          <PostSearch className="w-full bg-transparent shadow-none" />
        </div>
        <div className="container mx-auto px-1.5 py-2.5">
          <DataTable columns={columns} data={data} />
        </div>
        <div className="w-full flex py-1.5 px-3.5 items-center justify-between">
          <FullPagination
            currentPage={page}
            totalPages={total_page}
            take={take}
          />
        </div>
      </AdminBox>
    </div>
  );
}
