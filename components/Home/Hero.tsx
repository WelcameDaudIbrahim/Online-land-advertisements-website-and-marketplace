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
import Track from "../track/Track";
import heroImage from "./../../public/assets/home/hero.webp";
import blurHeroImage from "./../../public/assets/home/blur_hero.webp";

export default function Hero() {
  const [propertyFor, setPropertyFor] = useState<string>("rent");
  const [propertyType, setPropertyType] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  return (
    <div className="relative w-full h-[16vh] sm:h-[20vh] md:h-[56vh] flex-wrap inline-block">
      <div className="absolute -bottom-32 right-[-50%] size-[430.34px] md:w-[730.34px] md:h-[729.48px] bg-gradient-to-br from-slate-400 via-slate-500 to-teal-800 rounded-full blur-[1200px] -z-20"></div>
      <Image
        src={heroImage}
        alt="Hero Image"
        className="absolute right-0 top-0 h-[36vh] sm:h-[44vh] md:h-[82vh] !w-[auto] -z-10"
        width="719"
        height="700"
        quality={60}
        rel="preload"
        placeholder="blur"
        priority={true}
        loading="eager"
        blurDataURL={
          "data:image/png;base64,UklGRiABAABXRUJQVlA4WAoAAAAQAAAAFAAAEwAAQUxQSFEAAAABGQJJW7ztj+h/HGwaSXK0+SN+PYXHu96kDSFiAhQ5kgExG45+8X09BOhfEKRCUQOF4xoEiyI0BlcgEjzCmCjo0cAYGAqFY2gBwhyE4SDoAxwAVlA4IKgAAABwBQCdASoVABQAPok2lUelIyIhN/VYAKARCUAToDFwzeYZ0JjwHSi8OVjvMjehxW1It/wAAP72DFNj8AHfhfndrkwf077SQnWdcAAMxInRgI5OSkfDWs8by0y4+B2Ng7UCaVVuj6Pa9hYzDvKs+cTNvxmcxhtG7c+BcgfmIbC+ETXBH12t4MOt9/K+YymP9gVIkSNuGrvx2O6fxyyssD5bNhHkuxpEAAA="
        }
      />
      <div className="mt-3.5 md:ml-16 md:mt-16 text-2xl md:text-[48px]">
        <h1 className="text-black font-semibold text-center md:text-start ml-0.5 sm:ml-6 md:ml-0 font-roboto md:leading-[23.28px] tracking-[4.48px]">
          Your Path to the Perfect <br />
          <span className="text-primary md:text-black font-semibold font-quicksand md:leading-[97.28px] tracking-[4.48px]">
            Property
            <Image
              src={"/assets/home/line.png"}
              alt="line"
              width="240"
              height="4"
              className="-mt-[0.8rem] rotate-[-3deg] hidden md:block"
              quality={100}
            />
          </span>
        </h1>
        <div className="flex items-center w-full justify-center mt-3.5 md:mt-16 max-w-[1244px]">
          <div className="flex items-center gap-1.5 mb-2">
            <Button
              onClick={() => setPropertyFor("rent")}
              className={`text-white px-1.5 py-0 md:px-2.5 md:py-5 rounded-[1px] md:rounded-sm text-sm md:text-base font-medium font-roboto leading-none md:leading-[30px] tracking-normal md:tracking-wide hover:bg-primary-500 hover:text-white border-2 border-primary ${
                propertyFor === "rent"
                  ? "bg-primary"
                  : "bg-[#f4f4f4] text-black"
              }`}
            >
              For Rent
            </Button>
            <Button
              onClick={() => setPropertyFor("sale")}
              className={`text-[#f4f4f4] px-1.5 py-0 md:px-2.5 md:py-5 rounded-[1px] md:rounded-sm text-sm md:text-base font-medium font-roboto leading-none md:leading-[30px] tracking-normal md:tracking-wide hover:bg-primary-500 hover:text-white border-2 border-primary ${
                propertyFor === "sale" ? "bg-primary" : "bg-white text-black"
              }`}
            >
              For Sale
            </Button>
          </div>
        </div>
        <div className="flex items-center mx-auto flex-col sm:flex-row justify-between md:mx-0 px-2.5 md:px-4 py-2 w-[92%] sm:w-[99%] m:w-full max-w-[1244px] gap-y-1 sm:gap-2.5 bg-gray-200 shadow md:shadow-lg rounded-sm">
          <SearchBar onChange={(value) => setAddress(value)} />
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
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.replace(
                  `/listing?type=${propertyType}&for=${propertyFor}&search=${address}`
                );
              }
            }}
            className="flex items-center text-white text-base font-roboto tracking-wide w-full gap-1 sm:gap-0 sm:w-auto"
          >
            <Search className="size-5 mr-0.5 -mt-0.5" /> Search
          </Button>
        </div>
      </div>
    </div>
  );
}
