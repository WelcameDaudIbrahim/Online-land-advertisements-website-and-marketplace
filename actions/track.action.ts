"use server";

import db from "@/db/db";

export const track = async (data: {
  ip: string | undefined;
  url: string | undefined;
  screen: string;
  browser: string;
  browserVersion: string;
  browserMajorVersion: number;
  mobile: boolean;
  os: string;
  osVersion: unknown;
  cookies: boolean;
}) => {
  const locationData = await fetch(
    `http://ip-api.com/json/${data.ip}?fields=status,message,continent,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,proxy,query`
  );
  const locationJson = await locationData.json();

  const { message, ...location } = locationJson;

  await db.userInfo.create({
    data: { ...data, ...location },
  });
};
