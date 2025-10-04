"use client";

import { useState, useTransition, useRef } from "react";
import { getSuggestedTagsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<string[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSuggestTags = () => {
    const content = contentRef.current?.value;
    if (!content) return;

    startTransition(async () => {
      const result = await getSuggestedTagsAction({ content });
      if (result.tags) {
        setTags(currentTags => [...new Set([...currentTags, ...result.tags!])]);
        toast({
          title: "Tags Suggested",
          description: "AI has suggested some tags for your post.",
        });
      }
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  };

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
      <div className="grid gap-2">
        <Label className="font-headline">Tags</Label>
        <div className="flex items-start gap-4">
          <Button variant="outline" size="sm" onClick={handleSuggestTags} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
            Suggest Tags
          </Button>
          <div className="flex flex-wrap gap-2 pt-1 flex-1 min-h-[2.25rem]">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-accent/20">#{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
       <Button type="submit" size="lg">Launch Post</Button>
    </div>
  );
}
