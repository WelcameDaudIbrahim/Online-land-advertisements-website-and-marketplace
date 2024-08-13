import { getFilterPosts } from "@/actions/post.action";
import Posts from "@/components/posts/Posts";
import db from "@/db/db";
import { $Enums } from "@prisma/client";
import React from "react";

export default function FilterPosts({
  type = undefined,
  Propertyfor = undefined,
  bedroom = 0,
  bathroom = 0,
  minAera = 0,
  maxArea = 0,
}: {
  type?: $Enums.PropertyType | undefined;
  Propertyfor?: $Enums.PropertyFor | undefined;
  bedroom?: number;
  bathroom?: number;
  minAera?: number;
  maxArea?: number;
}) {
  return (
    <Posts
      getPosts={async () =>
        await getFilterPosts(
          type,
          Propertyfor,
          minAera,
          maxArea,
          bedroom,
          bathroom
        )
      }
      text=""
      vertical={false}
    />
  );
}
