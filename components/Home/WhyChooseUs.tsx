import { CalendarCheck2, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export default function WhyChooseUs() {
  return (
    <div className="px-16 pt-8 pb-4 flex items-center flex-col">
      <h2 className="text-black text-[40px] font-bold font-roboto leading-[48px] text-center mb-12">
        Why Choose Us?
      </h2>
      <div className="flex items-center gap-12 ">
        <div className="flex items-center gap-4 flex-col">
          <CalendarCheck2 className="size-10" />
          <h4 className=" text-black text-2xl font-bold font-roboto leading-[33.60px]">
            Verified Listings
          </h4>
          <p className="text-black text-base font-normal font-roboto leading-normal w-full text-center">
            Browse only verified properties to ensure your peace of mind.
          </p>
          <Button
            variant="link"
            className="text-black text-base font-normal font-roboto leading-normal gap-1 mt-2"
          >
            Learn More <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4 flex-col">
          <CalendarCheck2 className="size-10" />
          <h4 className=" text-black text-2xl font-bold font-roboto leading-[33.60px]">
            Up-to-Date Information
          </h4>
          <p className="text-black text-base font-normal font-roboto leading-normal w-full text-center">
            Access the latest listings and detailed property information to make
            informed decisions.
          </p>
          <Button
            variant="link"
            className="text-black text-base font-normal font-roboto leading-normal gap-1 mt-2"
          >
            Learn More <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4 flex-col">
          <CalendarCheck2 className="size-10" />
          <h4 className=" text-black text-2xl font-bold font-roboto leading-[33.60px]">
            24/7 Support
          </h4>
          <p className="text-black text-base font-normal font-roboto leading-normal w-full text-center">
            Get help whenever you need it with our dedicated customer support
            team.
          </p>
          <Button
            variant="link"
            className="text-black text-base font-normal font-roboto leading-normal gap-1 mt-2"
          >
            Learn More <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
