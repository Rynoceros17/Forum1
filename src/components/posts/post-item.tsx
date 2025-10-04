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
    <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className="flex">
        <div className="p-2 sm:p-4 bg-black/30 flex flex-col items-center justify-start gap-1">
          <VoteButtons postId={post.id} initialThrust={post.thrust} />
        </div>
        <Link href={`/p/${post.id}`} className="flex-1 cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.avatar} alt={`@${post.author}`} />
                <AvatarFallback>{post.system.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link href={`/s/${post.system.toLowerCase()}`} className="font-bold text-foreground hover:underline hover:text-primary z-10 relative">s/{post.system}</Link>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Posted by u/{post.author}</span>
              <span className="whitespace-nowrap">{timeAgo}</span>
            </div>
            <CardTitle className="text-lg font-headline mt-2">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="pr-4 sm:pr-6">
            <p className="text-sm text-foreground/80 line-clamp-4">{post.content}</p>
          </CardContent>
        </Link>
      </div>
       <CardFooter className="gap-2 sm:gap-4 pb-4 bg-black/10 pt-4">
            <Link href={`/p/${post.id}#comments`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post.commentCount || 0} Comments
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
        </CardFooter>
    </Card>
  );
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex">
        <div className="p-2 sm:p-4 bg-black/30 flex flex-col items-center justify-start gap-1">
          <Skeleton className="h-8 w-8 rounded-md bg-muted/50" />
          <Skeleton className="h-4 w-6 rounded-md bg-muted/50" />
          <Skeleton className="h-8 w-8 rounded-md bg-muted/50" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-muted/50" />
            <Skeleton className="h-4 w-24 bg-muted/50" />
          </div>
          <Skeleton className="h-6 w-3/4 bg-muted/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-muted/50" />
            <Skeleton className="h-4 w-5/6 bg-muted/50" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 p-4 bg-black/10">
        <Skeleton className="h-8 w-28 bg-muted/50" />
        <Skeleton className="h-8 w-24 bg-muted/50" />
      </div>
    </Card>
  );
}
