import { Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "../posts/create-post-dialog";
import { UserNav } from "../auth/user-nav";
import { useUser } from "@/firebase";
import { AuthDialog } from "../auth/auth-dialog";
import { Skeleton } from "../ui/skeleton";

export function Header() {
  const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Rocket className="h-6 w-6 text-accent" />
            <span className="font-bold font-headline text-lg">
              Cosmic Orbit
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Orbit
            </Link>
            <Link
              href="/discover"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Star Map
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <CreatePostDialog />
          {isUserLoading && <Skeleton className="h-8 w-8 rounded-full" />}
          {!isUserLoading && !user && <AuthDialog />}
          {!isUserLoading && user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  );
}
