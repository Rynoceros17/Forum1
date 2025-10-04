'use client';

import type { Comment } from '@/app/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export function CommentItem({ comment }: { comment: Comment }) {
  const timeAgo = comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : '';

  return (
    <div className="flex gap-3 py-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.avatar} alt={`@${comment.author}`} />
        <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-bold text-foreground">u/{comment.author}</span>
          <span>{timeAgo}</span>
        </div>
        <p className="text-sm text-foreground/90 mt-1">{comment.content}</p>
      </div>
    </div>
  );
}
