import { getFilterPosts } from "@/actions/post.action";
import Posts from "@/components/posts/Posts";
import { $Enums } from "@prisma/client";
import React from "react";

export default function FilterPosts({
  propertyType = undefined,
  Propertyfor = undefined,
  bedroom = 0,
  bathroom = 0,
  minAera = 0,
  maxArea = 0,
  page = 1,
  searchQuery = "",
}: {
  propertyType?: $Enums.post_property_type | undefined;
  Propertyfor?: $Enums.post_property_for | undefined;
  bedroom?: number;
  bathroom?: number;
  minAera?: number;
  maxArea?: number;
  page?: number;
  searchQuery?: string;
}) {
  console.log(searchQuery);

  async function getPosts() {
    return await getFilterPosts({
      propertyType,
      propertyFor: Propertyfor,
      minAreaNumber: minAera,
      maxAreaNumber: maxArea,
      bedroomNumber: bedroom,
      bathroomNumber: bathroom,
      page,
      take: 12,
      search: searchQuery,
    });
  }
  return <Posts getPosts={getPosts} text="" vertical={false} />;
}
