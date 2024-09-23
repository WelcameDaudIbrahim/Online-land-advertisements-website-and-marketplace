import { AdminHeader } from "@/components/admin/layout/Utils";
import React from "react";
import AdminCreatePostButton from "../../_components/AdminBackButton copy";
import { BrowserChart } from "../../_components/VisitorCharts";
import db from "@/db/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics",
};
const getBrowserData = async (privateBrowser: boolean = false) => {
  let privateBrowserQuery = {};

  if (privateBrowser) {
    privateBrowserQuery = { equals: null };
  } else {
    privateBrowserQuery = { not: null };
  }

  const browser_data = await db.userinfo.groupBy({
    by: ["browser", "ip"],
    having: {
      ip: { ...privateBrowserQuery },
    },
    _count: true,
  });

  const browser_data_formatted: {
    browser: string;
    visitors: number;
    fill: string;
  }[] = [];

  browser_data.map((data) => {
    const browser =
      data.browser === null
        ? ""
        : data.browser.toLowerCase().replaceAll(" ", "_");

    let color = "var(--color-usb)";
    switch (browser) {
      case "chrome":
        color = "var(--color-chrome)";
        break;
      case "safari":
        color = "var(--color-safari)";
        break;
      case "firefox":
        color = "var(--color-firefox)";
        break;
      case "edge":
        color = "var(--color-edge)";
        break;
      case "microsoft_edge":
        color = "var(--color-edge)";
        break;
      case "samsung":
        color = "var(--color-samsung)";
        break;
      case "other":
        color = "var(--color-other)";
        break;
      case "opera":
        color = "var(--color-opera)";
        break;
      default:
        color = "var(--color-usb)";
    }

    browser_data_formatted.push({
      browser: browser,
      visitors: data._count,
      fill: color,
    });
  });
  return browser_data_formatted;
};

export default async function page() {
  const browserChartData = await getBrowserData();
  const privateBrowserChartData = await getBrowserData(true);

  return (
    <div className="w-full flex flex-wrap ">
      <div className="flex items-center w-full justify-between py-2.5 mt-2.5 mb-4 mx-4">
        <AdminHeader>Visitor Statistics</AdminHeader>
        <AdminCreatePostButton />
      </div>
      <div className="grid grid-cols-3 w-full px-2.5 gap-x-2.5 mt-2.5 mx-4">
        <BrowserChart chartData={browserChartData} />
        <BrowserChart
          chartData={privateBrowserChartData}
          text={"Untracked Visitors Browser"}
        />
      </div>
    </div>
  );
}
