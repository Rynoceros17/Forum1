"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users2 } from "lucide-react";
import { useUser } from "@/firebase";
import { useState } from "react";
import { AuthDialog } from "../auth/auth-dialog";
import { CreateSystemForm } from "./create-system-form";

export function CreateSystemDialog() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const triggerButton = (
    <Button variant="outline">
      <Users2 className="mr-2 h-4 w-4" />
      Add Community
    </Button>
  );

  if (!user) {
    return <AuthDialog>{triggerButton}</AuthDialog>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Found a New System</DialogTitle>
          <DialogDescription>
            Create a new community for others to join.
          </DialogDescription>
        </DialogHeader>
        <CreateSystemForm onCompletion={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
