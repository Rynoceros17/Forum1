'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { posts as mockPosts } from "@/app/lib/mock-data";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { RecentDiscoveries } from "@/components/discoveries/recent-discoveries";
import { SystemNavigation } from "@/components/layout/system-navigation";

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
      <main className="container mx-auto px-4 py-8">
        <RecentDiscoveries />
        <SystemNavigation />
        
        <div className="mt-8">
            <h2 className="text-2xl font-headline mb-4">Recent Transmissions</h2>
            <div className="space-y-4">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
              {!isLoading && displayPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
