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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { systems } from "@/app/lib/mock-data";
import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  system: z.string().min(1, "Please select a system to post in"),
  image: z.any().optional(),
});

export function CreatePostForm({ onCompletion }: { onCompletion: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      system: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
    form.setValue("image", null);
  }

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
      avatar: user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`,
      imageUrl: imagePreview,
      thrust: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
    });

    toast({
      title: "Post Launched!",
      description: "Your post is now live in the cosmos.",
    });

    form.reset();
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
              <FormLabel className="font-headline">Target System</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a system to post in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.slug} value={system.name}>
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
              <FormLabel className="font-headline">Transmission Log Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="An interesting title for your transmission"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
            <FormItem>
                <FormLabel className="font-headline">Image (Optional)</FormLabel>
                <FormControl>
                <div className="relative">
                    <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                        field.onChange(e.target.files);
                        handleImageChange(e);
                    }}
                    />
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75 transition-colors">
                        <div className="text-center text-muted-foreground">
                            <ImageIcon className="mx-auto h-8 w-8" />
                            <p className="mt-2 text-sm">Click to upload an image</p>
                        </div>
                    </div>
                </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {imagePreview && (
            <div className="relative w-full max-h-96 overflow-hidden rounded-md border">
                <Image src={imagePreview} alt="Image preview" width={600} height={400} className="w-full h-auto object-contain" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={removeImage}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-headline">Transmission Content</FormLabel>
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
        <Button type="submit" size="lg" className="w-full">
          Launch Post
        </Button>
      </form>
    </Form>
  );
}
