'use client';

import { systems } from '@/app/lib/mock-data';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, MessageCircle, Megaphone, Newspaper } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
    'spacetalk': MessageCircle,
    'exoplanet-announcements': Megaphone,
    'nasa-news': Newspaper
}

export function SystemNavigation() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-headline mb-4">Explore Systems</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((system) => {
            const Icon = iconMap[system.slug] || Rocket;
            return (
              <Link key={system.slug} href={`/s/${system.slug}`} className="block hover:translate-y-[-2px] transition-transform duration-200">
                <Card className="h-full border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="font-headline text-lg">{system.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">{system.description}</CardDescription>
                        </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
        })}
      </div>
    </div>
  );
}
