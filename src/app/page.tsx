'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query, limit } from "firebase/firestore";
import type { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { RecentDiscoveries } from "@/components/discoveries/recent-discoveries";
import { useState, useEffect }from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Star, Zap, ChevronDown, ChevronUp } from "lucide-react";

type FilterOption = 'new' | 'hot' | 'top';

const INITIAL_POST_COUNT = 5;

export default function Home() {
  const firestore = useFirestore();
  const [filter, setFilter] = useState<FilterOption>('new');
  const [hiddenSystems, setHiddenSystems] = useState<Set<string>>(new Set());
  const [systemsInitialized, setSystemsInitialized] = useState(false);
  const [visiblePostCounts, setVisiblePostCounts] = useState<Record<string, number>>({});

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

  useEffect(() => {
    if (posts && !systemsInitialized) {
      const allSystems = Object.keys(postsBySystem);
      const initialHidden = new Set(allSystems.filter(system => system !== 'Space Talk'));
      setHiddenSystems(initialHidden);
      
      const initialCounts: Record<string, number> = {};
      allSystems.forEach(system => {
        initialCounts[system] = INITIAL_POST_COUNT;
      });
      setVisiblePostCounts(initialCounts);
      
      setSystemsInitialized(true);
    }
  }, [posts, postsBySystem, systemsInitialized]);

  const filterButtons: {id: FilterOption, label: string, icon: React.ElementType}[] = [
    { id: 'new', label: 'New', icon: Zap },
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'top', label: 'Top', icon: Star },
  ];

  const toggleSystemVisibility = (systemName: string) => {
    setHiddenSystems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(systemName)) {
        newSet.delete(systemName);
      } else {
        newSet.add(systemName);
      }
      return newSet;
    });
  };

  const showMorePosts = (systemName: string) => {
    setVisiblePostCounts(prev => ({
      ...prev,
      [systemName]: (prev[systemName] || INITIAL_POST_COUNT) + 5
    }));
  };

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

            <div className="space-y-4">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
              {!isLoading && posts && posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-headline">No transmissions found.</p>
                  <p>It's quiet in this corner of the galaxy...</p>
                </div>
              )}
              {!isLoading && Object.entries(postsBySystem).map(([system, systemPosts]) => {
                const isHidden = hiddenSystems.has(system);
                const visibleCount = visiblePostCounts[system] || INITIAL_POST_COUNT;
                const hasMore = systemPosts.length > visibleCount;

                return (
                  <div key={system} className={cn(
                      "p-4 rounded-lg bg-primary/5 border border-primary/20 transition-all",
                      isHidden && 'pb-2'
                    )}>
                    <div className={cn(
                      "flex items-center gap-2",
                      isHidden ? 'mb-0' : 'mb-4'
                    )}>
                      <h3 className={cn("text-2xl font-bold font-headline", system === 'NASA News' ? 'text-amber-400' : 'text-primary')}>{system}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSystemVisibility(system)}
                        className="h-7 w-7 text-muted-foreground"
                        aria-label={isHidden ? `Show posts from ${system}` : `Hide posts from ${system}`}
                      >
                        {isHidden ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                      </Button>
                    </div>
                    {!isHidden && (
                      <div className="space-y-4">
                        {systemPosts.slice(0, visibleCount).map((post) => (
                          <PostItem key={post.id} post={post} />
                        ))}
                        {hasMore && (
                          <div className="flex justify-center pt-2">
                            <Button variant="secondary" onClick={() => showMorePosts(system)}>
                              Show More
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      </main>
    </div>
  );
}
