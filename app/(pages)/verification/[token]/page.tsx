"use server";
import db from "@/db/db";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params }: { params: { token: string } }) {
  const { token } = params;
  if (!token) return notFound();

  const existingToken = await db.verificationToken.findFirst({
    where: { token },
  });
  if (!existingToken) return notFound();

  const user = await db.user.findUnique({
    where: { email: existingToken.email },
  });
  if (!user || user.emailVerified) return notFound();

  if (new Date(existingToken.expires) <= new Date()) {
    await db.verificationToken.delete({
      where: {
        token,
      },
    });
    return notFound();
  }

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { token },
  });
  return (
    <h1 className="text-primary-500 text-center m-auto mt-32 text-3xl font-roboto font-medium tracking-wide">
      Email Verified Succeessfully{" "}
      <button className="text-secondary" onClick={window.location.reload}>
        Reload
      </button>
    </h1>
  );
}
