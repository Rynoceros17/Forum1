'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { posts as mockPosts, systems } from "@/app/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { Rocket } from "lucide-react";

export default function Home() {
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const displayPosts = posts && posts.length > 0 ? posts : mockPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
          {!isLoading && displayPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
        <aside className="space-y-6">
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Top Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {systems.map((system, index) => (
                  <li key={system.name}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-bold w-4">{index + 1}</span>
                         <Avatar className="h-6 w-6">
                           <AvatarFallback className="bg-muted-foreground/20 text-xs">
                             <Rocket className="h-3 w-3"/>
                           </AvatarFallback>
                         </Avatar>
                        <Link href={`/${system.name}`} className="font-medium hover:text-accent transition-colors">{system.name}</Link>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">Join</Button>
                    </div>
                    {index < systems.length - 1 && <Separator className="bg-border/60"/>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
