// "use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import sharp from "sharp";
import { ReadonlyURLSearchParams } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitize(data: string) {
  return DOMPurify.sanitize(data);
}

export function range(start: number, end: number, step = 1) {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " Months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " Days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " Hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " Minutes";
  }
  return Math.floor(seconds) + " Seconds";
};

export const compress = async (
  image: sharp.Sharp,
  target?: number,
  size?: number
) => {
  const output_image = image.jpeg({ quality: 40 });
  return output_image;
};
export async function createFile(
  path: string,
  name: string,
  type: string
): Promise<File> {
  let response = await fetch(path);
  let data = await response.blob();
  let metadata = {
    type: type,
  };
  return new File([data], name, metadata);
}
export const UpdateQuery = (
  datas: { field: string; value?: string }[],
  searchParams: ReadonlyURLSearchParams,
  pathname: string
) => {
  let path: [string, string][] | string = Array.from(searchParams.entries());
  datas.map((data, i) => {
    const { field, value } = data;
    const current = new URLSearchParams(path);

    if (!value) {
      current.delete(field);
    } else {
      current.set(field, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    path = query;
  });
  return `${pathname}${path}`;
};
