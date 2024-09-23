import Image from "next/image";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};
export default function page() {
  return (
    <div className="px-6 mt-2.5">
      <div className="w-full mb-2.5 min-h-[42vh] relative">
        <Image
          src="/assets/signup.png"
          alt="logo"
          width={400}
          height={1000}
          className="object-cover opacity-35 !w-full !h-full absolute top-0 left-0 rounded"
          priority
          quality={20}
        />
        <div className="absolute top-0 left-0 z-10 w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl text text-center font-bold tracking-wider text-primary">
            About Us
          </h1>
          <p className="text-black tracking-wide text-lg mb-2.5 mt-4">
            Welcome to <span className="text-primary">Bdlord</span>, A trusted
            and growing real estate platform in Bangladesh, Bdlord connects
            property owners and seekers with ease.
          </p>
        </div>
      </div>
      <div>
        <p className="text-black tracking-wide text-lg mb-2.5 mt-1">
          At <span className="text-primary">Bdlord</span>, we offer verified
          property listings and connect buyers, sellers, and agents. Our
          platform ensures seamless transactions with free assistance and expert
          guidance, while we continue to grow and improve across Bangladesh.
        </p>
        <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
          Our Vision
        </h2>
        <p className="text-black tracking-wide text-lg mb-2.5 mt-1">
          At <span className="text-primary">Bdlord</span>, we simplify property
          searches with verified listings for homes, land, and commercial
          spaces. Our platform connects buyers, sellers, and agents, offering
          free assistance and expert guidance. Though new, we’re committed to
          expanding and improving to meet the needs of property seekers across
          Bangladesh.
        </p>
        <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
          Our Mission
        </h2>
        <p className="text-black tracking-wide text-lg mb-2.5 mt-1">
          Our mission is to build a trusted and user-friendly platform that
          caters to all aspects of real estate transactions in Bangladesh.
          Whether you are looking to buy, sell, or rent,
          <span className="text-primary"> Bdlord</span> is here to provide you
          with the most accurate and comprehensive information, helping you make
          the best decisions. We strive to bridge the gap between property
          seekers and sellers by offering a wide selection of verified listings
          and direct access to agents, developers, and landlords.
        </p>
        <h2 className="text-3xl text-center font-bold tracking-wider mt-8 mb-1.5">
          Why Choose <span className="text-primary">Bdlord</span>?
        </h2>
        <ul className=" mt-1.5 ml-1.5">
          <li className="text-black tracking-wide text-lg my-0.5">
            <span className="text-primary font-bold tracking-wider">
              Verified Listings:{" "}
            </span>
            We ensure that all properties listed on
            <span className="text-primary"> Bdlord </span>
            are thoroughly verified to provide accurate and up-to-date
            information.
          </li>
          <li className="text-black tracking-wide text-lg my-0.5">
            <span className="text-primary font-bold tracking-wider">
              Free Buying:{" "}
            </span>
            Assistance: Our team is dedicated to assisting property seekers in
            every step of the buying or renting process.
          </li>
          <li className="text-black tracking-wide text-lg my-0.5">
            <span className="text-primary font-bold tracking-wider">
              Wide Selection:{" "}
            </span>
            From residential homes and apartments to commercial spaces and land,
            we offer a diverse range of properties to choose from.
          </li>
          <li className="text-black tracking-wide text-lg my-0.5">
            <span className="text-primary font-bold tracking-wider">
              Seamless Connectivity:{" "}
            </span>
            Our platform connects buyers directly with sellers, agents, and
            landlords for smooth and transparent transactions.
          </li>
          <li className="text-black tracking-wide text-lg my-0.5">
            <span className="text-primary font-bold tracking-wider">
              User-Friendly:{" "}
            </span>
            Interface: Designed with simplicity in mind, our platform makes it
            easy to search, compare, and inquire about properties.
          </li>
        </ul>
        <p className="text-black text-center w-full mt-4 tracking-wide text-lg mb-2.5 ">
          Our Commitment to You <br />
          As we continue to develop and expand our platform,
          <span className="text-primary">Bdlord</span> is committed to providing
          top-notch services that meet the needs of both property owners and
          seekers.
          <br />
          Whether you’re looking for a dream home, a smart investment, or the
          perfect commercial space,
        </p>
        <p className="text-center text-black tracking-wide text-base mb-2.5 mt-1">
          You can rely on us to guide you through the real estate market in
          Bangladesh.
        </p>
      </div>
    </div>
  );
}
