"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PostDetailView } from "./post-detail-view";

export function PostDetailDialog({
  postId,
  children,
}: {
  postId: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <PostDetailView postId={postId} />
      </DialogContent>
    </Dialog>
  );
}
