"use client";
import React, { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { usePathname, useSearchParams } from "next/navigation";
import { cn, UpdateQuery } from "@/lib/utils";
import SearchBar from "../SearchBar";
import { Search } from "lucide-react";
import { IoFilterSharp } from "react-icons/io5";
import { Filter } from "@/app/(pages)/listing/Filter";

export default function PostSearch({
  className,
  FilterButtonClassName,
}: {
  className?: string;
  FilterButtonClassName?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSubmit = () => {
    if (typeof window !== "undefined") {
      search !== searchParams.get("search")
        ? window.location.replace(
            UpdateQuery(
              [{ field: "search", value: search }],
              searchParams,
              pathname
            )
          )
        : "";
    }
  };

  const [search, setSearch] = useState(searchParams.get("search") || "");

  return (
    <div
      className={cn(
        "flex items-center mx-auto flex-row sm:flex-row justify-between gap-x-1 px-4 py-2 w-[92%] sm:w-[99%] m:w-full max-w-[1244px] gap-y-1 sm:gap-2.5 bg-gray-200 shadow-lg rounded-sm",
        className
      )}
    >
      <SearchBar
        onkeyEnter={onSubmit}
        onChange={(val) => setSearch(val)}
        value={search}
      />
      <Button
        onClick={onSubmit}
        className="flex max-w-fit items-center text-white text-base font-roboto tracking-wide w-full gap-1 sm:gap-0 sm:w-auto"
      >
        <Search className="size-5 mr-0.5 -mt-0.5" />
        <p className="hidden md:block">Search</p>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "flex max-w-fit items-center text-white text-base font-roboto tracking-wide w-full gap-1 sm:gap-0 sm:w-auto",
              FilterButtonClassName
            )}
          >
            <IoFilterSharp className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Filter</DialogTitle>
          <Filter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
