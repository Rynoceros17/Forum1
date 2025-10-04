"use client";

import { Rocket, Sparkles } from "lucide-react";
import Link from "next/link";
import { CreatePostDialog } from "../posts/create-post-dialog";
import { UserNav } from "../auth/user-nav";
import { useUser } from "@/firebase";
import { AuthDialog } from "../auth/auth-dialog";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export function Header() {
  const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6 group">
            <Rocket className="h-6 w-6 text-primary group-hover:animate-pulse" />
            <span className="font-bold font-headline text-lg bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Cosmic Orbit
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              href="/"
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              Orbit
            </Link>
            <Link
              href="/discover"
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              Star Map
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          {user && <CreatePostDialog />}
          {isUserLoading && <Skeleton className="h-9 w-24 rounded-md" />}
          {!isUserLoading && !user && (
            <>
              <CreatePostDialog />
              <AuthDialog />
            </>
          )}
          {!isUserLoading && user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  );
}
