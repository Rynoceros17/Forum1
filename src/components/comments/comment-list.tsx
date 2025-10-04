'use client';

import { useCollection, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, orderBy, query } from 'firebase/firestore';
import type { Comment } from '@/app/lib/types';
import { CommentItem } from './comment-item';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export function CommentList({ postId }: { postId: string }) {
  const firestore = useFirestore();

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  }, [firestore, postId]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  if (isLoading) {
    return (
        <div className="space-y-4">
            {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex gap-3 py-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
            ))}
        </div>
    )
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-headline mb-2">{comments?.length || 0} Comments</h3>
      <div className="flex flex-col divide-y divide-border/60">
        {comments && comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
