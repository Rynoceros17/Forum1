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

  // This button is the trigger for both logged-in and guest users.
  const triggerButton = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Post
    </Button>
  );

  if (!user) {
    // For guests, wrap the trigger button with AuthDialog.
    // Clicking "Post" will open the sign-in/sign-up modal.
    return <AuthDialog>{triggerButton}</AuthDialog>;
  }

  // For logged-in users, show the standard create post dialog.
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
