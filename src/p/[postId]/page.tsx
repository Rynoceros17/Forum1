'use client';

import { useDoc, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { Post } from '@/app/lib/types';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { VoteButtons } from '@/components/posts/vote-buttons';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { systems } from '@/app/lib/mock-data';
import Image from 'next/image';


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

export default function PostPage({ params: { postId } }: { params: { postId: string } }) {
  const firestore = useFirestore();

  const postRef = useMemoFirebase(() => {
    if (!firestore || !postId) return null;
    return doc(firestore, 'posts', postId);
  }, [firestore, postId]);

  const { data: post, isLoading } = useDoc<Post>(postRef);

  const timeAgo = post?.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : '';
  const system = post ? systems.find(s => s.name === post.system) : null;
  const systemSlug = system ? system.slug : post?.system.toLowerCase().replace(/ /g, '-');


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        {isLoading && <PostLoadingSkeleton />}
        {post && (
          <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
             <div className="flex">
                <div className="p-2 sm:p-4 bg-black/30 flex flex-col items-center justify-start gap-1">
                    <VoteButtons postId={post.id} initialThrust={post.thrust} />
                </div>
                <div className="flex-1">
                    <CardHeader className="pb-2 relative">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={post.avatar} alt={`@${post.author}`} />
                                <AvatarFallback>{post.system.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Link href={`/s/${systemSlug}`} className="font-bold text-foreground hover:underline hover:text-primary z-10 relative">s/{post.system}</Link>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">Posted by u/{post.author}</span>
                            <span className="whitespace-nowrap">{timeAgo}</span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl font-headline mt-2">{post.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-primary h-8 w-8">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pr-4 sm:pr-6">
                        {post.imageUrl && (
                            <div className="my-4 max-h-[600px] overflow-hidden rounded-md border">
                                <Image src={post.imageUrl} alt={post.title} width={800} height={600} className="w-full object-contain" />
                            </div>
                        )}
                        <p className="text-base text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                </div>
            </div>
          </Card>
        )}

        {!isLoading && !post && (
            <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle>404 - Post Not Found</CardTitle>
                  <CardDescription>This transmission seems to be lost in space.</CardDescription>
                </CardHeader>
            </Card>
        )}
      </main>
    </div>
  );
}
