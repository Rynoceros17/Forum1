"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlackHoleIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type VoteState = "up" | "down" | null;

export function VoteButtons({ initialThrust }: { initialThrust: number }) {
  const [vote, setVote] = useState<VoteState>(null);
  const [thrust, setThrust] = useState(initialThrust);

  const handleVote = (newVote: "up" | "down") => {
    setThrust(currentThrust => {
      // If clicking the same button, unvote
      if (newVote === vote) {
        setVote(null);
        return newVote === 'up' ? currentThrust - 1 : currentThrust + 1;
      }

      // If switching vote
      if (vote !== null) {
        setVote(newVote);
        return newVote === 'up' ? currentThrust + 2 : currentThrust - 2;
      }
      
      // If no vote, new vote
      setVote(newVote);
      return newVote === 'up' ? currentThrust + 1 : currentThrust - 1;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleVote("up")} 
        className={cn(
          "text-muted-foreground hover:text-accent",
          vote === 'up' && 'text-accent'
        )}
        aria-label="Upvote"
      >
        <Rocket className={cn("h-5 w-5 transition-transform duration-200", vote === 'up' && 'scale-125 -translate-y-0.5')} />
      </Button>
      <span className="font-bold text-sm font-headline w-10 text-center" title="ΔThrust">
        {thrust}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleVote("down")} 
        className={cn(
          "text-muted-foreground hover:text-primary",
          vote === 'down' && 'text-primary'
        )}
        aria-label="Downvote"
      >
        <BlackHoleIcon className={cn("h-5 w-5 transition-transform duration-200", vote === 'down' && 'scale-110 rotate-90')} />
      </Button>
    </div>
  );
}
