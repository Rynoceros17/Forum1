"use client";

import { Rocket } from "lucide-react";
import Link from "next/link";
import { CreatePostDialog } from "../posts/create-post-dialog";
import { UserNav } from "../auth/user-nav";
import { useUser } from "@/firebase";
import { AuthDialog } from "../auth/auth-dialog";
import { Skeleton } from "../ui/skeleton";
import { CreateSystemDialog } from "../systems/create-system-dialog";

export function Header() {
  const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6 group">
            <div className="p-1.5 bg-primary/10 rounded-lg">
                <Rocket className="h-6 w-6 text-primary group-hover:animate-pulse" />
            </div>
            <span className="font-bold font-headline text-lg bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              NOVASEEKRS
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <span className="text-muted-foreground">Find your piece of the universe.</span>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          {isUserLoading && <Skeleton className="h-9 w-48 rounded-md" />}
          {!isUserLoading && user && (
            <>
              <CreateSystemDialog />
              <CreatePostDialog />
              <UserNav user={user} />
            </>
          )}
          {!isUserLoading && !user && (
            <>
              {/* The CreatePostDialog now handles showing the AuthDialog for non-users */}
              <CreateSystemDialog />
              <CreatePostDialog />
              <AuthDialog />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
