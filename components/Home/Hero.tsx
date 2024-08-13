"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import SearchBar from "../SearchBar";
import { redirect } from "next/navigation";

export default function Hero() {
  const [propertyFor, setPropertyFor] = useState<string>("rent");
  const [propertyType, setPropertyType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  return (
    <div className="relative w-full md:h-[90vh] h-[16vh] sm:h-[20vh] flex-wrap inline-block">
      <div className="absolute -bottom-32 right-[-50%] size-[430.34px] md:w-[730.34px] md:h-[729.48px] bg-gradient-to-br from-slate-400 via-slate-500 to-teal-800 rounded-full blur-[1200px] -z-20"></div>
      <Image
        src="/assets/home/hero.png"
        alt="Hero Image"
        className="absolute right-0 top-0 h-full !w-[auto] -z-10"
        width="719"
        height="700"
      />
      <div className="ml-3.5 md:ml-20 mt-4 md:mt-24 text-2xl md:text-[64px]">
        <h1 className="text-black  font-semibold font-roboto md:leading-[97.28px] tracking-[4.48px]">
          Your Path to the Perfect <br />
          <span className="text-primary md:text-black font-semibold font-quicksand md:leading-[97.28px] tracking-[4.48px]">
            Property
            <Image
              src={"/assets/home/line.png"}
              alt="line"
              width="300"
              height="4"
              className="-mt-4 hidden md:block "
              priority={true}
              quality={12}
            />
          </span>
        </h1>
        <p className="hidden md:block text-black mt-3.5 md:mt-8 text-sm md:text-xl font-normal font-roboto md:leading-[30px] max-w-[80%] md:max-w-[658px]">
          Find Your Perfect Place: Your Personalized Path to the Perfect
          Property. Let Us Be Your Real Estate Compass.
        </p>
        <div className="hidden md:flex items-center w-full justify-center mt-16 max-w-[1244px]">
          <div className="flex items-center gap-1.5 mb-2">
            <Button
              onClick={() => setPropertyFor("rent")}
              className={`text-white px-2.5 py-5 rounded-sm text-base font-medium font-roboto leading-[30px] tracking-wide hover:bg-primary-500 hover:text-white border-2 border-primary ${
                propertyFor === "rent"
                  ? "bg-primary"
                  : "bg-transparent text-black"
              }`}
            >
              For Rent
            </Button>
            <Button
              onClick={() => setPropertyFor("sale")}
              className={`text-white px-2.5 py-5 rounded-sm text-base font-medium font-roboto leading-[30px] tracking-wide hover:bg-primary-500 hover:text-white border-2 border-primary ${
                propertyFor === "sale"
                  ? "bg-primary"
                  : "bg-transparent text-black"
              }`}
            >
              For Sale
            </Button>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-between px-4 py-2 w-full max-w-[1244px] gap-2.5 bg-gray-200 shadow-lg rounded-sm">
          <SearchBar onChange={(value) => setLocation(value)} />
          <Select onValueChange={(value) => setPropertyType(value)}>
            <SelectTrigger
              className="flex-grow"
              style={{ border: "2px solid rgb(214, 211, 209) !important" }}
            >
              <SelectValue placeholder="Select Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              window.location.replace(
                `/listing?type=${propertyType}&for=${propertyFor}&location=${location}`
              )
            }
            className="flex items-center text-white text-base font-roboto tracking-wide"
          >
            <Search className="size-5 mr-0.5 -mt-0.5" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
}
