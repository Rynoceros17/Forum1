
'use client';
import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { useCollection, useFirestore } from "@/firebase";
import { collection, orderBy, query, limit } from "firebase/firestore";
import type { Post } from "@/app/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Star, Zap, ChevronDown, ChevronUp } from "lucide-react";

type FilterOption = 'new' | 'hot' | 'top';

const INITIAL_POST_COUNT = 5;

export default function Home() {
  const firestore = useFirestore();
  const [filtersBySystem, setFiltersBySystem] = useState<Record<string, FilterOption>>({});
  const [hiddenSystems, setHiddenSystems] = useState<Set<string>>(new Set());
  const [systemsInitialized, setSystemsInitialized] = useState(false);
  const [visiblePostCounts, setVisiblePostCounts] = useState<Record<string, number>>({});

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Fetch all recent posts, sort by creation date initially. The per-system sorting will be handled on the client.
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(100));
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<Post>(postsQuery);

  const postsBySystem = useMemo(() => posts?.reduce((acc, post) => {
    if (!post.system) return acc; // Guard against posts without a system
    if (!acc[post.system]) {
      acc[post.system] = [];
    }
    acc[post.system].push(post);
    return acc;
  }, {} as Record<string, Post[]>) || {}, [posts]);

  const systemOrder = useMemo(() => {
    if (!posts) return [];
    // Establish a stable order of systems based on the most recent post in each system.
    const systemWithLatestPost = Object.entries(postsBySystem).map(([system, posts]) => {
      const latestPost = posts.reduce((latest, current) => 
        (current.createdAt && latest.createdAt && current.createdAt.toMillis() > latest.createdAt.toMillis()) ? current : latest, 
        posts[0]
      );
      return { system, latestTimestamp: latestPost.createdAt };
    });
    
    systemWithLatestPost.sort((a, b) => (b.latestTimestamp?.toMillis() || 0) - (a.latestTimestamp?.toMillis() || 0));

    return systemWithLatestPost.map(s => s.system);
  }, [posts, postsBySystem]);


  useEffect(() => {
    if (posts && !systemsInitialized) {
      const allSystems = Object.keys(postsBySystem);
      // Start with all systems hidden, then make "Space Talk" visible.
      const initialHidden = new Set<string>(allSystems);
      if (initialHidden.has("Space Talk")) {
        initialHidden.delete("Space Talk");
      }
      setHiddenSystems(initialHidden);
      
      const initialCounts: Record<string, number> = {};
      const initialFilters: Record<string, FilterOption> = {};
      allSystems.forEach(system => {
        initialCounts[system] = INITIAL_POST_COUNT;
        initialFilters[system] = 'new'; // Default filter for each system
      });
      setVisiblePostCounts(initialCounts);
      setFiltersBySystem(initialFilters);
      
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

  const handleSetFilter = (systemName: string, filter: FilterOption) => {
    setFiltersBySystem(prev => ({
      ...prev,
      [systemName]: filter,
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 gap-4">
              <h2 className="text-3xl font-bold font-headline">Exoplanets Forum</h2>
            </div>

            <div className="space-y-4">
              {isLoading && Array.from({ length: 3 }).map((_, i) => <PostItem.Skeleton key={i} />)}
              {!isLoading && posts && posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-headline">No transmissions found.</p>
                  <p>It's quiet in this corner of the galaxy...</p>
                </div>
              )}
              {!isLoading && systemOrder.map((system) => {
                const systemPosts = postsBySystem[system];
                if (!systemPosts) return null;

                const currentFilter = filtersBySystem[system] || 'new';

                const sortedSystemPosts = [...systemPosts].sort((a, b) => {
                    switch (currentFilter) {
                        case 'hot':
                        case 'top':
                            return (b.thrust || 0) - (a.thrust || 0);
                        case 'new':
                        default:
                            return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
                    }
                });

                const isHidden = hiddenSystems.has(system);
                const visibleCount = visiblePostCounts[system] || INITIAL_POST_COUNT;
                const hasMore = sortedSystemPosts.length > visibleCount;

                return (
                  <div key={system} className={cn(
                      "p-4 rounded-lg bg-primary/5 border border-primary/20 transition-all",
                      isHidden ? 'pb-2' : 'pb-4'
                    )}>
                    <div className={cn(
                      "flex items-center justify-between gap-2",
                      isHidden ? 'mb-0' : 'mb-4'
                    )}>
                      <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2 rounded-lg bg-card/80 border p-1">
                        {filterButtons.map(({id, label, icon: Icon}) => (
                          <Button 
                            key={id} 
                            variant={currentFilter === id ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => handleSetFilter(system, id)}
                            className={cn(
                              "flex-1 justify-center sm:justify-start px-4 py-1.5 h-auto transition-all duration-200",
                              currentFilter === id && 'shadow-md bg-primary/90 hover:bg-primary'
                            )}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {!isHidden && (
                      <div className="space-y-4">
                        {sortedSystemPosts.slice(0, visibleCount).map((post) => (
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
