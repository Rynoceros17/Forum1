"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CreatePostForm() {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title" className="font-headline">Title</Label>
        <Input id="title" placeholder="An interesting title for your mission log" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content" className="font-headline">Content</Label>
        <Textarea
          id="content"
          ref={contentRef}
          placeholder="What's on your mind, astronaut? Describe your findings, share your art, or start a discussion."
          rows={8}
        />
      </div>
       <Button type="submit" size="lg">Launch Post</Button>
    </div>
  );
}
