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
import { PlusCircle } from "lucide-react";
import { CreatePostForm } from "./create-post-form";
import { useUser } from "@/firebase";
import { useState } from "react";
import { AuthDialog } from "../auth/auth-dialog";

export function CreatePostDialog() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  // If the user is not logged in, the DialogTrigger for AuthDialog
  // will be rendered inside the main Dialog component.
  // We don't render AuthDialog directly here anymore to avoid duplicates.
  const triggerButton = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Launchpad
    </Button>
  );

  if (!user) {
    // Wrap the trigger in AuthDialog to handle authentication
    return <AuthDialog>{triggerButton}</AuthDialog>;
  }

  // If the user is logged in, show the create post dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Launch a New Post</DialogTitle>
          <DialogDescription>
            Share your discoveries with the galaxy.
          </DialogDescription>
        </DialogHeader>
        <CreatePostForm onCompletion={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
