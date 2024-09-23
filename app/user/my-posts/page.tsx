import { columns } from "./columns";
import { FullPagination } from "@/components/ui/pagination";
import db from "@/db/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { DataTable } from "./data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Posts",
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await auth();

  if (!user) return notFound();

  const message = searchParams?.message === "created" ? "created" : false;

  const take = Number(searchParams?.take) || 10;
  const page = Number(searchParams?.page) || 1;
  const total_page =
    (await db.post.count({ where: { userId: user.user.id } })) / take;

  const query = { take: take, skip: page * take - take };

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
      pending: true,
      status: true,
    },
    ...query,
  });

  return (
    <div className="px-3.5">
      <h1 className="text-black font-roboto text-3xl mb-4 font-medium tracking-wide">
        My Posts
      </h1>
      <div className="container mx-auto px-1.5 py-2.5">
        <DataTable columns={columns} data={data} message={message} />
      </div>
      <div className="w-full flex py-1.5 px-3.5 items-center justify-between">
        <FullPagination
          currentPage={page}
          totalPages={total_page}
          take={take}
        />
      </div>
    </div>
  );
}
