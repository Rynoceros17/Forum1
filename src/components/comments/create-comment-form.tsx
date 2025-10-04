'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { collection, doc, increment, serverTimestamp, writeBatch } from 'firebase/firestore';
import { AuthDialog } from '../auth/auth-dialog';

const formSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
});

export function CreateCommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) return;

    const postRef = doc(firestore, 'posts', postId);
    const commentRef = doc(collection(firestore, 'posts', postId, 'comments'));
    
    const batch = writeBatch(firestore);

    batch.set(commentRef, {
      content: values.content,
      authorId: user.uid,
      author: user.displayName || user.email,
      avatar: user.photoURL || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.uid}`,
      createdAt: serverTimestamp(),
    });

    batch.update(postRef, { commentCount: increment(1) });

    try {
        await batch.commit();
        form.reset();
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Failed to comment",
            description: error.message || "Could not submit your comment. Please try again."
        })
    }

  }

  if (!user) {
    return (
      <div className="mt-6 border-t border-border/60 pt-6 flex items-center gap-4">
        <p className="text-muted-foreground">Log in to leave a comment</p>
        <AuthDialog>
            <Button variant="outline">Sign In to Comment</Button>
        </AuthDialog>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-border/60 pt-6" id="comments">
        <h3 className="text-lg font-headline mb-4">Add a comment as {user.displayName || user.email}</h3>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Textarea placeholder="What are your thoughts?" {...field} rows={4} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit Comment</Button>
        </form>
        </Form>
    </div>
  );
}
