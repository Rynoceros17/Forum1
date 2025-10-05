
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { recentDiscoveries } from "@/app/lib/exoplanets";
import Image from "next/image";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentDiscoveries() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Recent Exoplanet Discoveries</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {recentDiscoveries.map((planet) => (
              <CarouselItem key={planet.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="group relative overflow-hidden rounded-lg border-2 border-transparent hover:border-amber-400/80 transition-colors duration-300">
                  {planet.banner && (
                     <div className={cn(
                        "absolute top-0 left-0 z-10 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider",
                        planet.banner.color
                      )}>
                       {planet.banner.text}
                     </div>
                  )}
                  <Image
                    src={planet.imageUrl}
                    alt={planet.name}
                    width={400}
                    height={300}
                    data-ai-hint={planet.imageHint}
                    className="h-48 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-headline text-lg text-white">{planet.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Users className="h-3 w-3 mr-1.5 text-primary"/>
                      <span className="text-white/90">Discovered by u/{planet.discoveredBy}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
