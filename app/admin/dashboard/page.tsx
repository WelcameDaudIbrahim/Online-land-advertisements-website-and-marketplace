import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";
import AdminCreatePostButton from "../_components/AdminBackButton copy";
import { AdminHeader } from "@/components/admin/layout/Utils";
import db from "@/db/db";
import { PostByTime } from "../_components/dashboardChart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function page() {
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const total_posts = await db.post.count();
  const active_total_posts = await db.post.count({ where: { status: true } });
  const pending_total_posts = await db.post.count({ where: { pending: true } });
  const deleted_total_posts = await db.deletedpost.count();
  const previous_month_total_posts = await db.post.count({
    where: {
      created_at: {
        gt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
  });
  const this_month_total_posts = await db.post.count({
    where: {
      created_at: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
  });
  const posts_count_by_month_chart_data = await db.post.groupBy({
    by: "updated_at",
    _count: true,
    where: {
      created_at: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
    },
  });

  const posts_count_by_month_chart_data_formatted: {
    month: string;
    posts: number;
  }[] = [];

  posts_count_by_month_chart_data.map((data) => {
    const month = data.updated_at.toLocaleString("default", { month: "long" });
    const index = posts_count_by_month_chart_data_formatted.findIndex(
      (obj) => obj.month === month
    );
    if (index === -1) {
      posts_count_by_month_chart_data_formatted.push({
        month: month,
        posts: data._count,
      });
    } else {
      posts_count_by_month_chart_data_formatted[index].posts += data._count;
    }
  });

  posts_count_by_month_chart_data_formatted.sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
  return (
    <div className="w-full flex flex-wrap">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4 mx-4">
        <AdminHeader>Dashboard</AdminHeader>
        <AdminCreatePostButton />
      </div>
      <div className="grid grid-cols-4 w-full px-2.5 gap-x-2.5">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Posts Overview</CardTitle>
            <CardDescription>Total Posts Statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium tracking-wide">
              Total Posts: {total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Deleted Posts: {deleted_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Active Posts: {active_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Inactive Posts: {total_posts - active_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Requested Posts: {pending_total_posts}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Posts Overview By Date
            </CardTitle>
            <CardDescription>Total Posts Statistics By Date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium tracking-wide">
              Previous Month Post: {previous_month_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              This Month Post: {this_month_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Active Posts: {active_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Inactive Posts: {total_posts - active_total_posts}
            </p>
            <p className="text-lg font-medium tracking-wide">
              Requested Posts: {pending_total_posts}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 w-full px-2.5 gap-x-2.5 mt-2.5 mx-4">
        <PostByTime data={posts_count_by_month_chart_data_formatted} />
      </div>
    </div>
  );
}
