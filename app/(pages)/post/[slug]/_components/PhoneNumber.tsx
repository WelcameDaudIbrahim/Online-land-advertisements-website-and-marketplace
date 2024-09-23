"use client";
import React, { useState } from "react";

export default function PhoneNumber({ phoneNumber }: { phoneNumber: string }) {
  const [number, setNumber] = useState(`${phoneNumber.slice(0, 3)}XXXXXXXX`);
  return (
    <>
      <h6 className="text-2xl tracking-wider font-semibold">
        +88{!phoneNumber.startsWith("0") && "0"}
        {number}
      </h6>
      <p
        onClick={() => setNumber(phoneNumber)}
        className="text-base text-black hover:text-primary text-center font-medium font-roboto tracking-wide leading-5 mt-1 cursor-pointer"
      >
        Show The Number
      </p>
    </>
  );
}
