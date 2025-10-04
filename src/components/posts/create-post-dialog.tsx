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

  if (!user) {
    // This button will now trigger the AuthDialog
    return <AuthDialog />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Launchpad
        </Button>
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
