"use client";
import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/form";
import { Alert } from "@/components/ui/alert-dialog";
import { changeContactUsStatus } from "@/actions/user.action";
import { redirect } from "next/navigation";

export default function ContactUsStatus({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const [userStatus, setUserStatus] = useState<string>(status);

  const [isStatusPending, startStatusTransition] = useTransition();
  return (
    <div className="flex items-center">
      <Select onValueChange={(value) => setUserStatus(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Done" disabled={status === "Done"}>
            Done
          </SelectItem>
          <SelectItem value="Pending" disabled={status === "Pending"}>
            Pending
          </SelectItem>
        </SelectContent>
      </Select>
      {userStatus !== status && (
        <Alert
          description="Are you sure you want to update the status"
          onContinue={() => {
            startStatusTransition(async () => {
              const returnValue = await changeContactUsStatus(id, userStatus);
              if (returnValue) {
                setUserStatus(status);
                redirect("/admin/contact_us/");
              }
            });
          }}
        >
          <SubmitButton
            isPending={isStatusPending}
            disabled={isStatusPending}
            className="ml-4 min-w-min w-[60px]"
          >
            ✓
          </SubmitButton>
        </Alert>
      )}
    </div>
  );
}
