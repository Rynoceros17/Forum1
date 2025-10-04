'use client';
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButtons } from "./vote-buttons";
import type { Post } from "@/app/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "../ui/skeleton";

export function PostItem({ post }: { post: Post }) {

  const timeAgo = post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : post.time;

  return (
    <Card className="overflow-hidden border-border bg-card/80 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10">
      <div className="flex">
        <div className="p-2 sm:p-4 bg-black/20 flex flex-col items-center justify-start">
          <VoteButtons postId={post.id} initialThrust={post.thrust} />
        </div>
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.avatar} alt={`@${post.author}`} />
                <AvatarFallback>{post.system.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link href={`/s/${post.system.toLowerCase()}`} className="font-bold text-foreground hover:underline hover:text-accent">s/{post.system}</Link>
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
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
              <MessageSquare className="mr-2 h-4 w-4" />
              {post.comments} Comments
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card/80 backdrop-blur-sm">
      <div className="flex">
        <div className="p-2 sm:p-4 bg-black/20 flex flex-col items-center justify-start gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-4 w-6 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
