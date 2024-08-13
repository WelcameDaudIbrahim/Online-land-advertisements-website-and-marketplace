"use client";
import React, { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FilterPosts from "./FilterPosts";
import { $Enums } from "@prisma/client";
import { FullPagination } from "@/components/ui/pagination";

export default function Page() {
  const searchParams = useSearchParams();

  const bathroomNumberParams = searchParams.get("bathroom");
  const bedroomNumberParams = searchParams.get("bedroom");
  const propertyTypeParams = searchParams.get("type");
  const propertyForParams = searchParams.get("for");
  const minAreaParams = searchParams.get("minArea");
  const maxAreaParams = searchParams.get("maxArea");
  return (
    <section className="flex gap-y-3.5">
      <div className="px-2 w-full max-w-[358px]">
        <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full"></div>
        <Filter />
      </div>
      <div className="w-full">
        <FilterPosts
          type={
            propertyTypeParams !== null
              ? ["residential", "commercial"].includes(
                  propertyTypeParams.toLowerCase()
                )
                ? (propertyTypeParams as $Enums.PropertyType)
                : undefined
              : undefined
          }
          Propertyfor={
            propertyForParams !== null
              ? ["sale", "rent"].includes(propertyForParams.toLowerCase())
                ? (propertyForParams as $Enums.PropertyFor)
                : undefined
              : undefined
          }
          minAera={Number(minAreaParams) || undefined}
          maxArea={Number(maxAreaParams) || undefined}
          bathroom={Number(bathroomNumberParams) || 0}
          bedroom={Number(bedroomNumberParams) || 0}
        />
        <FullPagination
          currentPage={1}
          totalPages={10}
          onPageChange={(page) => {
            console.log(page);
          }}
        />
      </div>
    </section>
  );
}
function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bathroomNumberParams = searchParams.get("bathroom");
  const bedroomNumberParams = searchParams.get("bedroom");
  const propertyTypeParams = searchParams.get("type");
  const propertyForParams = searchParams.get("for");
  const minAreaParams = searchParams.get("minArea");
  const maxAreaParams = searchParams.get("maxArea");

  const [minArea, setMinArea] = useState(Number(minAreaParams));
  const [maxArea, setMaxArea] = useState(Number(maxAreaParams));

  const [propertyType, setPropertyType] = useState<
    "residential" | "commercial" | undefined
  >(
    propertyTypeParams === "residential"
      ? "residential"
      : propertyTypeParams === "commercial"
      ? "commercial"
      : undefined
  );
  const [propertyFor, setPropertyFor] = useState<"sale" | "rent" | undefined>(
    propertyForParams === "rent"
      ? "rent"
      : propertyForParams === "sale"
      ? "sale"
      : undefined
  );
  const [bathroomNumber, setBathroomNumber] = useState(
    bathroomNumberParams || 0
  );
  const [bedroomNumber, setBedroomNumber] = useState(bedroomNumberParams || 0);

  const UpdateQuery = (datas: { field: string; value?: string }[]) => {
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

  const onFilter = () => {
    const params: { field: string; value?: string }[] = [];

    if (bathroomNumberParams !== bathroomNumber && !!bathroomNumber) {
      params.push({ field: "bathroom", value: bathroomNumber.toString() });
    }

    if (bedroomNumberParams !== bedroomNumber && !!bedroomNumber) {
      params.push({ field: "bedroom", value: bedroomNumber.toString() });
    }

    if (propertyTypeParams !== propertyType && !!propertyType) {
      params.push({ field: "type", value: propertyType });
    }

    if (propertyForParams !== propertyFor && !!propertyFor) {
      params.push({ field: "for", value: propertyFor });
    }

    if (Number(minAreaParams) !== minArea && !!minArea) {
      params.push({ field: "minArea", value: minArea.toString() });
    }

    if (Number(maxAreaParams) !== maxArea && !!maxArea) {
      params.push({ field: "maxArea", value: bedroomNumber.toString() });
    }
    if (params.length > 0) {
      window.location.replace(UpdateQuery(params));
    }
  };
  return (
    <div className="flex items-center">
      <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
        <div className="mt-2.5 box rounded border border-gray-300 bg-white p-6 w-full md:max-w-sm">
          <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
            <p className="font-medium text-base leading-7 text-black ">
              Filter Posts
            </p>
            <Link href={pathname}>
              <p className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-primary">
                RESET
              </p>
            </Link>
          </div>
          <p className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1.5">
            Property Area (SQFT)
          </p>
          <div className="flex flex-row gap-x-4 gap-y-1.5">
            <div className="flex items-center cursor-pointer col-span-6">
              <Input
                type="number"
                placeholder="Min Area"
                className="w-full"
                value={minArea}
                onChange={(e) => setMinArea(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center justify-center font-roboto font-medium text-black text-center">
              -
            </div>
            <div className="flex items-center cursor-pointer col-span-6">
              <Input
                type="number"
                placeholder="Max Area"
                className="w-full"
                value={maxArea}
                onChange={(e) => setMaxArea(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <p className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1.5">
            Property Type
          </p>
          <div className="flex flex-row gap-x-4 gap-y-1.5 px-2.5">
            <div className="flex items-center cursor-pointer">
              <input
                id="residential"
                type="checkbox"
                className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-primary-500 hover:bg-primary hover:bg-opacity-40 checked:bg-no-repeat checked:bg-center checked:border-primary checked:bg-primary checked:bg-opacity-35 checked:bg-[url('/assets/listing/checked.svg')] "
                onChange={(e) =>
                  setPropertyType(
                    propertyType !== "residential"
                      ? e.currentTarget.value === "residential"
                        ? "residential"
                        : undefined
                      : undefined
                  )
                }
                checked={propertyType === "residential"}
                value="residential"
              />
              <label
                htmlFor="residential"
                className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
              >
                Residential
              </label>
            </div>
            <div className="flex items-center cursor-pointer">
              <input
                id="commercial"
                type="checkbox"
                className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-primary-500 hover:bg-primary hover:bg-opacity-40 checked:bg-no-repeat checked:bg-center checked:border-primary checked:bg-primary checked:bg-opacity-35 checked:bg-[url('/assets/listing/checked.svg')]"
                onChange={(e) =>
                  setPropertyType(
                    propertyType !== "commercial"
                      ? e.currentTarget.value === "commercial"
                        ? "commercial"
                        : undefined
                      : undefined
                  )
                }
                checked={propertyType === "commercial"}
                value="commercial"
              />
              <label
                htmlFor="commercial"
                className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
              >
                Commercial
              </label>
            </div>
          </div>
          <p className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1.5">
            Property For
          </p>
          <div className="box flex flex-row gap-x-4 gap-y-1.5 px-2.5">
            <div className="flex items-center cursor-pointer">
              <input
                id="rent"
                type="checkbox"
                onChange={(e) =>
                  setPropertyFor(
                    e.currentTarget.value === "rent" ? "rent" : undefined
                  )
                }
                checked={propertyFor === "rent"}
                value="rent"
                className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-primary-500 hover:bg-primary hover:bg-opacity-40 checked:bg-no-repeat checked:bg-center checked:border-primary checked:bg-primary checked:bg-opacity-35 checked:bg-[url('/assets/listing/checked.svg')] "
              />
              <label
                htmlFor="rent"
                className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
              >
                Rent
              </label>
            </div>
            <div className="flex items-center cursor-pointer">
              <input
                id="sale"
                type="checkbox"
                className="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-primary-500 hover:bg-primary hover:bg-opacity-40 checked:bg-no-repeat checked:bg-center checked:border-primary checked:bg-primary checked:bg-opacity-35 checked:bg-[url('/assets/listing/checked.svg')]"
                onChange={(e) =>
                  setPropertyFor(
                    e.currentTarget.value === "sale" ? "sale" : undefined
                  )
                }
                value="sale"
                checked={propertyFor === "sale"}
              />
              <label
                htmlFor="sale"
                className="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
              >
                Sale
              </label>
            </div>
          </div>
          <p className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1.5">
            Number of Bathroom
          </p>
          <div className="flex flex-row gap-x-4 gap-y-1.5">
            <div className="flex items-center cursor-pointer w-full">
              <Input
                type="number"
                placeholder="Number Of Bathroom"
                className="w-full"
                value={bathroomNumber}
                min={0}
                max={11}
                onChange={(e) => setBathroomNumber(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <p className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1.5">
            Number of Bedroom
          </p>
          <div className="flex flex-row gap-x-4 gap-y-1.5">
            <div className="flex items-center cursor-pointer w-full">
              <Input
                type="number"
                placeholder="Number Of Bedroom"
                className="w-full"
                min={0}
                max={11}
                value={bedroomNumber}
                onChange={(e) => setBedroomNumber(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <label
            htmlFor="Offer"
            className="font-medium text-sm leading-6 mt-2.5 text-gray-600 mb-1"
          >
            Offer
          </label>
          <Select>
            <SelectTrigger id="Offer" className="w-full mt-1">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex mt-2.5 flex-row gap-x-4 gap-y-1.5">
            <div className="flex items-center flex-1">
              <Button
                onClick={() => onFilter()}
                className="w-full border-2 border-primary hover:bg-transparent hover:text-black"
              >
                Filter
              </Button>
            </div>
            <div className="flex items-center flex-1">
              <Link href={pathname} className="w-full">
                <Button variant={"link"} className="w-full">
                  Reset
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
