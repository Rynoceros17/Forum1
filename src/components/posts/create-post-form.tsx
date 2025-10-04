"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { systems } from "@/app/lib/mock-data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  system: z.string().min(1, "Please select a system"),
});

export function CreatePostForm({ onCompletion }: { onCompletion: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      system: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a post.",
      });
      return;
    }

    const postsCollection = collection(firestore, "posts");
    addDocumentNonBlocking(postsCollection, {
      title: values.title,
      content: values.content,
      system: values.system,
      author: user.displayName || user.email,
      authorId: user.uid,
      avatar: user.photoURL || "",
      thrust: 0,
      comments: 0,
      createdAt: serverTimestamp(),
    });

    toast({
      title: "Post Launched!",
      description: "Your post is now live in the cosmos.",
    });

    onCompletion();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="system"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">System</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a system to post in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.name} value={system.name.replace('s/','')}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="An interesting title for your mission log"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">Content</FormLabel>
              <FormControl>
                <Textarea
                  id="content"
                  placeholder="What's on your mind, astronaut? Describe your findings, share your art, or start a discussion."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg">
          Launch Post
        </Button>
      </form>
    </Form>
  );
}
