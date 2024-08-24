import React from "react";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import { getResetPasswordEmail } from "@/actions/auth.action";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { token: string } }) {
  const { token } = params;
  const email = await getResetPasswordEmail(token);

  if (!email) {
    return notFound();
  }

  return <ForgotPasswordForm token={token} />;
}
