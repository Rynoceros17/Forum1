'use client';

import { Header } from '@/components/layout/header';
import { PostDetailView } from '@/components/posts/post-detail-view';

export default function PostPage({ params }: { params: { postId: string } }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <PostDetailView postId={params.postId} />
      </main>
    </div>
  );
}
