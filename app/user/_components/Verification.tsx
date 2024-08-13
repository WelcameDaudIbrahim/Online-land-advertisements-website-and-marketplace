"use client";
import React, { useState, useTransition } from "react";
import useAuth from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldOff } from "lucide-react";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { sendVerification } from "@/actions/user.action";

export default function Verification() {
  const user = useAuth();
  if (!user || user.email === null || user.email === undefined) notFound();

  const [isEmailSent, setIsEmailSent] = useState(false);

  const emailVerified = !!user?.emailVerified;

  const [isPending, startTransition] = useTransition();
  return (
    !emailVerified && (
      <Alert className="mt-1.5 mb-2.5 w-fit px-4 mr-auto ml-4 border-red-800">
        {isPending ? (
          <LoadingSpinner className="size-3.5" />
        ) : (
          <ShieldOff className="size-3.5 text-red-800" />
        )}
        <AlertTitle>Security Warning!</AlertTitle>
        <AlertDescription>
          {!isEmailSent ? (
            isPending ? (
              "Sending Email..."
            ) : (
              <>
                Your Email Is Not Verified. Please Verify Your Email. If you
                have not got the mail, please check your spam folder.
                <span
                  onClick={() => {
                    startTransition(async () => {
                      await sendVerification(user.email as string);
                      setIsEmailSent(true);
                    });
                  }}
                  className="font-bold text-primary hover:text-primary-500 cursor-pointer"
                >
                  {" "}
                  Resend Email
                </span>
              </>
            )
          ) : (
            <>
              Email Send Successfully. If you have not got the mail, please
              check your spam folder.
              <span className="pointer-events-none font-bold text-primary-500 cursor-disabled">
                Email Sent Successfully.
              </span>
            </>
          )}
        </AlertDescription>
      </Alert>
    )
  );
}
