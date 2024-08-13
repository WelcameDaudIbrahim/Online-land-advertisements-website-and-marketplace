"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { divisions } from "@/data/admin/data";

export default function SearchBar({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([""]);
  useEffect(() => {
    const searchValueSplit = searchValue.split(" ");
    onChange(searchValue);
  }, [searchValue, onChange]);
  return (
    <div className="flex-grow flex w-full relative">
      <div
        className={`absolute w-full top-[100%] z-20 ${
          searchValue === "" && "hidden"
        }`}
      >
        <div className="z-50 min-w-[8rem] overflow-hidden rounded-b-md border bg-popover p-1 text-popover-foreground shadow-md w-full">
          <div className="px-2 py-1.5 text-sm font-semibold">Location</div>
          <div className="-mx-1 my-1 h-px bg-muted"></div>
          {locations.map((location, i) => (
            <div
              key={i}
              className="relative flex cursor-pointer hover:bg-accent select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
            >
              {location}
            </div>
          ))}
        </div>
      </div>
      <Input
        onChange={(e) => setSearchValue(e.target.value)}
        className="p-3 text-black placeholder-neutral-600 rounded-sm border-stone-300 border-2 text-base font-normal font-roboto leading-normal flex-grow"
        placeholder="Location"
        value={searchValue}
      />
    </div>
  );
}
