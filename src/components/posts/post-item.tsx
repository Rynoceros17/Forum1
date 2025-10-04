'use client';
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButtons } from "./vote-buttons";
import type { Post } from "@/app/lib/types";
import { formatDistanceToNow } from 'date-fns';

export function PostItem({ post }: { post: Post }) {

  const timeAgo = post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : post.time;

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-accent/40">
      <div className="flex">
        <div className="p-2 sm:p-4 bg-black/10 flex flex-col items-center justify-start">
          <VoteButtons postId={post.id} initialThrust={post.thrust} />
        </div>
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.avatar} alt={`@${post.author}`} />
                <AvatarFallback>{post.system.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link href={`/s/${post.system.toLowerCase()}`} className="font-bold text-foreground hover:underline">s/{post.system}</Link>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Posted by u/{post.author}</span>
              <span className="hidden sm:inline">{timeAgo}</span>
            </div>
            <CardTitle className="text-lg font-headline mt-2">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="pr-4 sm:pr-6">
            <p className="text-sm text-foreground/80 line-clamp-4">{post.content}</p>
          </CardContent>
          <CardFooter className="gap-2 sm:gap-4 pb-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              {post.comments} Comments
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
