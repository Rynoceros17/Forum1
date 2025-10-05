"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlackHoleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useFirestore, useUser } from "@/firebase";
import { doc, increment, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type VoteState = "up" | "down" | null;

export function VoteButtons({ postId, initialThrust }: { postId: string, initialThrust: number }) {
  const [vote, setVote] = useState<VoteState>(null);
  const [thrust, setThrust] = useState(initialThrust);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleVote = async (newVote: "up" | "down") => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to vote.",
      });
      return;
    }

    const postRef = doc(firestore, "posts", postId);
    const userVoteRef = doc(firestore, "users", user.uid, "votes", postId);
    
    let thrustChange = 0;
    let newVoteState: VoteState = newVote;

    const originalThrust = thrust;
    const originalVote = vote;

    if (newVote === vote) { // Undoing vote
      newVoteState = null;
      thrustChange = newVote === 'up' ? -1 : 1;
      deleteDocumentNonBlocking(userVoteRef);
    } else if (vote !== null) { // Switching vote
      thrustChange = newVote === 'up' ? 2 : -2;
      setDocumentNonBlocking(userVoteRef, { vote: newVote }, { merge: false });
    } else { // New vote
      thrustChange = newVote === 'up' ? 1 : -1;
      setDocumentNonBlocking(userVoteRef, { vote: newVote }, { merge: false });
    }

    setThrust(thrust + thrustChange);
    setVote(newVoteState);

    updateDocumentNonBlocking(postRef, { thrust: increment(thrustChange) });
  };

  return (
    <div className="flex flex-col items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleVote("up")} 
        className={cn(
          "text-muted-foreground hover:text-primary hover:bg-primary/10",
          vote === 'up' && 'text-primary'
        )}
        aria-label="Upvote"
      >
        <Rocket className={cn("h-5 w-5 transition-all duration-200", vote === 'up' && 'scale-125 -translate-y-0.5 fill-primary/40')} />
      </Button>
      <span className="font-bold text-sm font-headline w-10 text-center py-1" title="ΔThrust">
        {thrust}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleVote("down")} 
        className={cn(
          "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10",
          vote === 'down' && 'text-rose-500'
        )}
        aria-label="Downvote"
      >
        <BlackHoleIcon className={cn("h-5 w-5 transition-all duration-200", vote === 'down' && 'scale-110 rotate-[360deg] fill-rose-500/40')} />
      </Button>
    </div>
  );
}
