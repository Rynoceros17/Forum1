'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query, limit } from "firebase/firestore";
import type { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { RecentDiscoveries } from "@/components/discoveries/recent-discoveries";
import { useState }from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Star, Zap } from "lucide-react";

type FilterOption = 'new' | 'hot' | 'top';

export default function Home() {
  const firestore = useFirestore();
  const [filter, setFilter] = useState<FilterOption>('new');

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    let q = query(collection(firestore, 'posts'));

    switch (filter) {
      case 'hot':
      case 'top':
        q = query(q, orderBy('thrust', 'desc'));
        break;
      case 'new':
      default:
        q = query(q, orderBy('createdAt', 'desc'));
        break;
    }

    return query(q, limit(50));
  }, [firestore, filter]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const postsBySystem = posts?.reduce((acc, post) => {
    if (!acc[post.system]) {
      acc[post.system] = [];
    }
    acc[post.system].push(post);
    return acc;
  }, {} as Record<string, Post[]>) || {};

  const filterButtons: {id: FilterOption, label: string, icon: React.ElementType}[] = [
    { id: 'new', label: 'New', icon: Zap },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'top', label: 'Top', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecentDiscoveries />
        
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 gap-4">
              <h2 className="text-3xl font-bold font-headline">Exoplanets Forum</h2>
              <div className="flex items-center gap-2 rounded-lg bg-card/80 border p-1">
                {filterButtons.map(({id, label, icon: Icon}) => (
                  <Button 
                    key={id} 
                    variant={filter === id ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setFilter(id)}
                    className={cn(
                      "flex-1 justify-center sm:justify-start px-4 py-1.5 h-auto transition-all duration-200",
                      filter === id && 'shadow-md bg-primary/90 hover:bg-primary'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
              {!isLoading && posts && posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-headline">No transmissions found.</p>
                  <p>It's quiet in this corner of the galaxy...</p>
                </div>
              )}
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
