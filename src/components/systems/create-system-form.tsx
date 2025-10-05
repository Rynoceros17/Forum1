"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useUser } from "@/firebase";
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

const formSchema = z.object({
  name: z.string().min(3, "System name must be at least 3 characters.").max(30, "System name is too long."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(300, "Description is too long."),
});

function nameToSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function CreateSystemForm({ onCompletion }: { onCompletion: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a system.",
      });
      return;
    }

    const systemsCollection = collection(firestore, "systems");
    
    addDocumentNonBlocking(systemsCollection, {
      name: values.name,
      description: values.description,
      slug: nameToSlug(values.name),
      members: 1,
      createdAt: serverTimestamp(),
      ownerId: user.uid,
    });

    toast({
      title: "System Created!",
      description: `The ${values.name} system is now online.`,
    });

    form.reset();
    onCompletion();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">System Name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="e.g., 'Quantum Mechanics Debates'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">System Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="A brief summary of what this system is about."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          Establish System
        </Button>
      </form>
    </Form>
  );
}
