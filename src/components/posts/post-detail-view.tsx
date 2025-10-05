"use client";

import { useDoc, useFirestore } from "@/firebase";
import { useMemoFirebase } from "@/firebase/provider";
import { doc } from "firebase/firestore";
import type { Post } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { VoteButtons } from "@/components/posts/vote-buttons";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCommentForm } from "@/components/comments/create-comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { systems } from "@/app/lib/mock-data";
import { ScrollArea } from "../ui/scroll-area";

function PostLoadingSkeleton() {
  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-3/4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function PostDetailView({ postId }: { postId: string }) {
  const firestore = useFirestore();

  const postRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return doc(firestore, "posts", postId);
  }, [firestore, postId]);

  const { data: post, isLoading } = useDoc<Post>(postRef);

  const timeAgo = post?.createdAt
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
    : "";
  const system = post ? systems.find((s) => s.name === post.system) : null;
  const systemSlug = system
    ? system.slug
    : post?.system.toLowerCase().replace(/ /g, "-");

  if (isLoading) {
    return <PostLoadingSkeleton />;
  }

  if (!post) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>404 - Post Not Found</CardTitle>
          <CardDescription>
            This transmission seems to be lost in space.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="pr-6">
        <Card className="overflow-hidden border-0 shadow-none bg-transparent">
          <div className="flex">
            <div className="p-2 sm:p-4 bg-black/30 flex flex-col items-center justify-start gap-1">
              <VoteButtons postId={post.id} initialThrust={post.thrust} />
            </div>
            <div className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={post.avatar}
                      alt={`@${post.author}`}
                    />
                    <AvatarFallback>
                      {post.system.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/s/${systemSlug}`}
                    className="font-bold text-foreground hover:underline hover:text-primary z-10 relative"
                  >
                    s/{post.system}
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    Posted by u/{post.author}
                  </span>
                  <span className="whitespace-nowrap">{timeAgo}</span>
                </div>
                <CardTitle className="text-xl md:text-2xl font-headline mt-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pr-4 sm:pr-6">
                {post.imageUrl && (
                  <div className="mt-2 mb-4 max-h-[500px] overflow-hidden rounded-md border border-border/20">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={800}
                      height={500}
                      className="w-full object-contain"
                    />
                  </div>
                )}
                <p className="text-base text-foreground/90 whitespace-pre-wrap">
                  {post.content}
                </p>
              </CardContent>
              <CardFooter className="gap-2 sm:gap-4 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-black"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {post.commentCount || 0} Comments
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>

        <div className="mt-4">
          <CreateCommentForm postId={post.id} />
          <CommentList postId={post.id} />
        </div>
      </div>
    </ScrollArea>
  );
}
