import { Header } from "@/components/layout/header";
import { PostItem } from "@/components/posts/post-item";
import { posts, systems } from "@/app/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{
      backgroundImage: 'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.2), hsla(0,0%,100%,0))'
    }}>
      <Header />
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
        <aside className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Top Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {systems.map((system, index) => (
                  <li key={system.name}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-bold w-4">{index + 1}</span>
                         <Avatar className="h-6 w-6">
                           <AvatarFallback>{system.name.charAt(2).toUpperCase()}</AvatarFallback>
                         </Avatar>
                        <Link href={`/${system.name}`} className="font-medium hover:underline">{system.name}</Link>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                    {index < systems.length - 1 && <Separator className="bg-border/40"/>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
