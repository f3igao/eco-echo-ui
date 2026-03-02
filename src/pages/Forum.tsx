import { createForumPost, deleteForumPost, getForumPosts } from '@/api/forum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AuthPromptDialog } from '@/components/AuthPromptDialog';
import { useAuth } from '@/context/AuthContext';
import type { ForumPost } from '@/types/forum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  MessageSquare,
  PenLine,
  Search,
  TreePine,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function PostCard({
  post,
  canDelete,
  onDelete,
}: {
  post: ForumPost;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <Card className='hover:bg-accent/20 transition-colors'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <Link
            to={`/forum/${post.post_id}`}
            className='flex-1 min-w-0 group'
          >
            <h3 className='font-semibold text-base group-hover:text-primary transition-colors leading-snug'>
              {post.title}
            </h3>
          </Link>
          {canDelete && (
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive'
              onClick={onDelete}
            >
              <Trash2 className='w-3.5 h-3.5' />
            </Button>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
          <span className='font-medium text-foreground'>{post.user_name}</span>
          <span>·</span>
          <span className='flex items-center gap-1'>
            <CalendarDays className='w-3 h-3' />
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {post.park_name && (
            <>
              <span>·</span>
              <Badge variant='secondary' className='gap-1 text-xs py-0'>
                <TreePine className='w-3 h-3' />
                {post.park_name}
              </Badge>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className='pb-3'>
        <p className='text-sm text-muted-foreground line-clamp-2'>{post.body}</p>
        <div className='flex items-center gap-1 mt-2 text-xs text-muted-foreground'>
          <MessageSquare className='w-3.5 h-3.5' />
          {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
        </div>
      </CardContent>
    </Card>
  );
}

function NewPostForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [parkId, setParkId] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      createForumPost({
        user_id: user?.user_id ?? 0,
        title: title.trim(),
        body: body.trim(),
        park_id: parkId ? Number(parkId) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      onClose();
    },
  });

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !mutation.isPending;

  return (
    <Card className='mb-6'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>New Post</h3>
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onClose}>
            <X className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        <Textarea
          placeholder='What would you like to share?'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        <Input
          placeholder='Park ID (optional)'
          type='number'
          value={parkId}
          onChange={(e) => setParkId(e.target.value)}
        />
        {mutation.isError && (
          <p className='text-xs text-destructive'>Failed to post. Please try again.</p>
        )}
        <div className='flex justify-end gap-2'>
          <Button variant='outline' size='sm' onClick={onClose}>
            Cancel
          </Button>
          <Button size='sm' disabled={!canSubmit} onClick={() => mutation.mutate()}>
            {mutation.isPending ? 'Posting…' : 'Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Forum() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['forum-posts', debouncedSearch],
    queryFn: () =>
      getForumPosts({ search: debouncedSearch || undefined, limit: 50 }),
    staleTime: 2 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deleteForumPost(postId, user?.user_id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });

  const posts: ForumPost[] = data?.posts ?? [];

  function handleSearchChange(value: string) {
    setSearch(value);
    clearTimeout((handleSearchChange as { timer?: ReturnType<typeof setTimeout> }).timer);
    (handleSearchChange as { timer?: ReturnType<typeof setTimeout> }).timer = setTimeout(
      () => setDebouncedSearch(value),
      400,
    );
  }

  return (
    <>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <h2 className='text-3xl font-bold text-text'>Forum</h2>
        <div className='flex gap-2'>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              className='pl-9'
              placeholder='Search posts…'
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            className='gap-1.5 shrink-0'
            onClick={() => {
              if (!user) {
                setAuthPromptOpen(true);
              } else {
                setShowForm(true);
              }
            }}
          >
            <PenLine className='w-4 h-4' />
            New Post
          </Button>
        </div>
      </div>

      {showForm && <NewPostForm onClose={() => setShowForm(false)} />}

      {isLoading && (
        <p className='text-sm text-muted-foreground'>Loading posts…</p>
      )}

      {isError && (
        <p className='text-destructive text-sm'>
          Failed to load forum posts. Please try again.
        </p>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <p className='text-sm text-muted-foreground'>
          {debouncedSearch ? 'No posts match your search.' : 'No posts yet. Be the first to post!'}
        </p>
      )}

      <div className='flex flex-col gap-3'>
        {posts.map((post) => (
          <PostCard
            key={post.post_id}
            post={post}
            canDelete={user?.user_id === post.user_id}
            onDelete={() => deleteMutation.mutate(post.post_id)}
          />
        ))}
      </div>

      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        message='Sign in to post and join the conversation.'
      />
    </>
  );
}

export default Forum;
