
'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { posts as mockPosts, systems } from "@/app/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { Rocket, Rss, Users } from "lucide-react";

export default function SystemPage({ params }: { params: { systemName: string } }) {
  const firestore = useFirestore();
  
  const systemName = decodeURIComponent(params.systemName);
  
  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'posts'),
      where('system', '==', systemName),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, systemName]);
  
  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  // Find the current system from mock data to display its info
  const currentSystem = systems.find(s => s.name.toLowerCase() === `s/${systemName.toLowerCase()}`);
  const displayPosts = posts && posts.length > 0 ? posts : mockPosts.filter(p => p.system.toLowerCase() === systemName.toLowerCase());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
          {!isLoading && displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))
          ) : (
            !isLoading && (
              <Card className="text-center py-12">
                <CardHeader>
                  <CardTitle>No Transmissions Yet</CardTitle>
                  <CardDescription>Be the first to post in s/{systemName}.</CardDescription>
                </CardHeader>
              </Card>
            )
          )}
        </div>
        <aside className="space-y-6">
          {currentSystem && (
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-primary/50">
                  <AvatarFallback className="bg-muted-foreground/20 text-3xl">
                    <Rocket />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-xl">{currentSystem.name}</CardTitle>
                <CardDescription>Welcome to the {currentSystem.name} system.</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="my-4" />
                <div className="flex justify-around text-center">
                  <div>
                    <p className="font-bold text-lg">{currentSystem.members}</p>
                    <p className="text-xs text-muted-foreground">Astronauts</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Online</p>
                    <p className="text-xs text-muted-foreground">In Orbit</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button className="w-full hover:bg-primary/90">Join System</Button>
              </CardContent>
            </Card>
          )}
           <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">System Rules</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Be respectful to fellow astronauts.</li>
                    <li>Keep transmissions on-topic.</li>
                    <li>No spam or self-promotion.</li>
                    <li>Follow the galactic codex.</li>
                </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
