import React from "react";

import FilterPosts from "./FilterPosts";
import { $Enums } from "@prisma/client";
import { FullPagination } from "@/components/ui/pagination";
import { Filter } from "./Filter";
import PostSearch from "@/components/ui/table-search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties",
};
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const bathroomNumberParams = searchParams?.bathroom;
  const bedroomNumberParams = searchParams?.bedroom;
  const propertyTypeParams = searchParams?.type;
  const propertyForParams = searchParams?.for;
  const minAreaParams = searchParams?.minArea;
  const maxAreaParams = searchParams?.maxArea;
  const page = searchParams?.page;
  const search = searchParams?.search;
  return (
    <section className="flex max-w-[1148px] mx-auto flex-col w-full gap-y-3.5">
      <div className="mx-4 mt-3.5 md:mt-0">
        <PostSearch FilterButtonClassName="md:hidden" />
      </div>
      <div className="flex max-w-[1148px] mx-auto w-full gap-y-3.5">
        <div className="px-2 md:w-full max-w-[358px] hidden md:block">
          {/* <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full"></div> */}
          <Filter />
        </div>
        <div className="w-full ">
          <FilterPosts
            searchQuery={search !== undefined ? search : ""}
            page={page === undefined ? 1 : Number(page)}
            propertyType={
              propertyTypeParams !== null
                ? ["residential", "commercial"].includes(
                    propertyTypeParams?.toLowerCase() || ""
                  )
                  ? (propertyTypeParams as $Enums.post_property_type)
                  : undefined
                : undefined
            }
            Propertyfor={
              propertyForParams !== null
                ? ["sale", "rent"].includes(
                    propertyForParams?.toLowerCase() || ""
                  )
                  ? (propertyForParams as $Enums.post_property_for)
                  : undefined
                : undefined
            }
            minAera={Number(minAreaParams) || undefined}
            maxArea={Number(maxAreaParams) || undefined}
            bedroom={Number(bedroomNumberParams) || 0}
            bathroom={Number(bathroomNumberParams) || 0}
          />
          <FullPagination
            currentPage={page === undefined ? 1 : Number(page)}
            showNumbers={false}
          />
        </div>
      </div>
    </section>
  );
}
