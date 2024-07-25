"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full h-[90vh] flex-wrap overflow-hidden">
      <div className="absolute -bottom-32 right-[-50%] w-[730.34px] h-[729.48px] bg-gradient-to-br from-slate-400 via-slate-500 to-teal-800 rounded-full blur-[1200px] -z-20"></div>
      <Image
        src="/assets/home/hero.png"
        alt="Hero Image"
        className="absolute right-0 top-0 h-full !w-[auto] -z-10"
        width="719"
        height="700"
      />
      <div className="ml-20 mt-24">
        <h1 className="text-black text-[64px] font-semibold font-roboto leading-[97.28px] tracking-[4.48px]">
          Your Path to the Perfect <br />
          <span className="text-black text-[64px] font-semibold font-quicksand leading-[97.28px] tracking-[4.48px]">
            Property
            <Image
              src={"/assets/home/line.png"}
              alt="line"
              width="300"
              height="4"
              className="-mt-4 "
            />
          </span>
        </h1>
        <p className="text-black mt-8 text-xl font-normal font-roboto leading-[30px] max-w-[658px]">
          Find Your Perfect Place: Your Personalized Path to the Perfect
          Property. Let Us Be Your Real Estate Compass.
        </p>
        <div className="flex items-center w-full justify-center mt-16">
          <div className="flex items-center gap-1.5 mb-2">
            <Button className="text-white px-2.5 py-5 rounded-sm text-base font-medium font-roboto leading-[30px] tracking-wide hover:bg-primary-dark border-2 border-primary">
              For Rent
            </Button>
            <Button className="text-black bg-transparent border-2 border-primary px-2.5 py-5 rounded-sm text-base font-medium font-roboto leading-[30px] tracking-wide hover:bg-primary hover:text-white">
              For Sale
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 max-w-[1244px] gap-2.5 bg-gray-200 shadow-lg rounded-sm">
          <Input
            className="p-3 text-black placeholder-neutral-600 rounded-sm border-stone-300 border-2 text-base font-normal font-roboto leading-normal flex-grow"
            placeholder="Location"
          />
          <Select>
            <SelectTrigger
              className="flex-grow"
              style={{ border: "2px solid rgb(214, 211, 209) !important" }}
            >
              <SelectValue placeholder="Residential " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger
              className="flex-grow "
              style={{ border: "2px solid rgb(214, 211, 209) !important" }}
            >
              <SelectValue placeholder="Any Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">1-1000Sqft</SelectItem>
              <SelectItem value="dark">Worlds largest building</SelectItem>
              <SelectItem value="system">Chosse is Yours</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center text-white text-base font-roboto tracking-wide">
            <Search className="size-5 mr-0.5 -mt-0.5" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
}
