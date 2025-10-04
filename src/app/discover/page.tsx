import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Telescope } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{
      backgroundImage: 'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.2), hsla(0,0%,100%,0))'
    }}>
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Telescope className="h-6 w-6 text-accent"/>
              Star Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The interactive star map for discovering new Systems is currently under construction. Check back soon, astronaut!</p>
            <div className="mt-8 flex flex-col items-center justify-center text-muted-foreground h-96 border-2 border-dashed rounded-lg bg-black/10">
                <p className="font-headline text-lg">Interactive Map Coming Soon</p>
                <p className="text-sm">We're charting the constellations of our communities.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
