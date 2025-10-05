'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { posts as mockPosts } from "@/app/lib/mock-data";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import type { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { RecentDiscoveries } from "@/components/discoveries/recent-discoveries";

export default function Home() {
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const displayPosts = posts && posts.length > 0 ? posts : mockPosts;

  const postsBySystem = displayPosts.reduce((acc, post) => {
    if (!acc[post.system]) {
      acc[post.system] = [];
    }
    acc[post.system].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecentDiscoveries />
        
        <div className="mt-8">
            <h2 className="text-2xl font-headline mb-4">Recent Transmissions</h2>
            <div className="space-y-8">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
              {!isLoading && Object.entries(postsBySystem).map(([system, systemPosts]) => (
                <div key={system}>
                  <h3 className="text-xl font-headline mb-4">s/{system}</h3>
                  <div className="space-y-4">
                    {systemPosts.map((post) => (
                      <PostItem key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
