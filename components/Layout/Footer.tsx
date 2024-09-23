import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsInstagram, BsLinkedin, BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { TiLocation } from "react-icons/ti";

export default function Footer() {
  return (
    <div className="w-full mt-8 md:mt-12 h-auto px-12 md:px-16 pb-10 flex-col pt-8 md:pt-12 justify-start items-start gap-8 sm:gap-12 md:gap-20 flex relative">
      <Image
        alt="Footer Background"
        src="/assets/footer.jpg"
        width={1000}
        height={1000}
        quality={40}
        loading="lazy"
        className="w-full absolute -z-10 min-h-[422px] h-full object-cover top-0 left-0 opacity-[0.07]"
      />
      <div className="w-full justify-start items-start` md:gap-10  flex-wrap gap-4 grid grid-cols-1 sm:grid-cols-2 md:flex">
        <div className="flex-col justify-center items-start gap-6 flex">
          <div className="w-[111.65px] h-8 relative">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={111.65}
              height={8}
              loading="lazy"
            />
          </div>
          <div className="w-auto h-[90px] text-black text-sm font-normal font-roboto leading-[21px]">
            BDLord: Your Guide to a Perfect Property.
          </div>
        </div>
        <div className="flex-1 flex-col justify-start items-start gap-4 flex">
          <div className="text-black text-base font-semibold font-roboto leading-normal">
            Quick Links
          </div>
          <div className="h-[185px] flex-col justify-start items-start flex">
            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Home
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Properties
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Properties for Sale
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Properties for Rent
            </Link>
          </div>
        </div>
        <div className="flex-1 flex-col justify-start items-start gap-4 flex">
          <div className="text-black text-base font-semibold font-roboto leading-normal">
            Properties
          </div>
          <div className="h-[185px] flex-col justify-start items-start flex">
            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Apartments
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Houses
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Retail Spaces
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Office Spaces
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Industrial Properties
            </Link>
          </div>
        </div>
        <div className="flex-1 flex-col justify-start items-start gap-4 flex">
          <div className="text-black text-base font-semibold font-roboto leading-normal">
            About Bdlord
          </div>
          <div className="h-[111px] flex-col justify-start items-start flex">
            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Our Story
            </Link>

            <Link
              href="/"
              className="hover:text-primary grow shrink basis-0 text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Team
            </Link>

            <Link
              href="/"
              className="hover:text-primary w-[215.33px] text-black text-sm font-normal font-roboto leading-[21px]"
            >
              Post You Property
            </Link>
          </div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 flex">
          <div className="text-black text-base font-semibold font-roboto leading-normal">
            Contacts
          </div>
          <div className="h-[142px] flex-col justify-start items-start gap-3 flex">
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                123 Freshie Lane, Farmville, USA
              </div>
            </div>
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                +1-800-373-7443
                <br />
                +23-800-373-7443
              </div>
            </div>
            <div className="justify-start items-center gap-3 flex">
              <TiLocation className="size-6" />
              <div className="text-black text-sm font-medium font-roboto leading-[21px] tracking-wide">
                support@bdlord.com
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[57px] flex-col justify-between w-full items-start gap-8 flex">
        <div className="justify-between flex-col-reverse sm:flex-row items-start w-full flex">
          <div className="justify-start items-center gap-6 flex">
            <div className="text-black text-sm font-normal font-roboto leading-[21px]">
              © {new Date().getFullYear()} BDLord. All rights reserved.
            </div>
          </div>
          <div className="justify-start items-start gap-3 flex">
            <div className="">
              <Link href="/">
                <FaFacebook className="size-6 text-black hover:text-[#4267B2]" />
              </Link>
            </div>
            <div className="">
              <Link href="/">
                <BsInstagram className="size-6 text-black hover:text-[#fa7e1e]" />
              </Link>
            </div>
            <div className="">
              <Link href="/">
                <BsTwitterX className="size-6 text-black hover:text-[#0f0f0f]" />
              </Link>
            </div>
            <div className="">
              <Link href="/">
                <BsLinkedin className="size-6 text-black hover:text-[#0e76a8]" />
              </Link>
            </div>
            <div className="">
              <Link href="/">
                <BsYoutube className="size-6 text-black hover:text-[#c4302b]" />
              </Link>
            </div>
          </div>
          <div className="justify-start items-start gap-6 flex">
            <div className="text-black text-sm font-normal font-roboto underline leading-[21px]">
              Privacy Policy
            </div>
            <div className="text-black text-sm font-normal font-roboto underline leading-[21px]">
              Terms of Service
            </div>
            <div className="text-black text-sm font-normal font-roboto underline leading-[21px]">
              Contact Us
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
