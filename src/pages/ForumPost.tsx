import {
  createForumComment,
  deleteForumComment,
  deleteForumPost,
  getForumPost,
} from '@/api/forum';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AuthPromptDialog } from '@/components/AuthPromptDialog';
import { useAuth } from '@/context/AuthContext';
import type { ForumComment } from '@/types/forum';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  Send,
  Trash2,
  TreePine,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function CommentItem({
  comment,
  canDelete,
  onDelete,
}: {
  comment: ForumComment;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <div className='py-3 flex gap-3'>
      <div className='w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
        {comment.user_name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 text-sm'>
            <Link
              to={`/users/${comment.user_id}`}
              className='font-medium hover:text-primary transition-colors'
            >
              {comment.user_name}
            </Link>
            <span className='text-xs text-muted-foreground flex items-center gap-1'>
              <CalendarDays className='w-3 h-3' />
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {canDelete && (
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6 text-muted-foreground hover:text-destructive shrink-0'
              onClick={onDelete}
            >
              <Trash2 className='w-3 h-3' />
            </Button>
          )}
        </div>
        <p className='text-sm mt-1 text-foreground/90'>{comment.body}</p>
      </div>
    </div>
  );
}

function ForumPost() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState('');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const id = Number(postId);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['forum-post', id],
    queryFn: () => getForumPost(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

  const deletePostMutation = useMutation({
    mutationFn: () => deleteForumPost(id, user?.user_id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      navigate('/forum');
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: () =>
      createForumComment(id, { user_id: user?.user_id ?? 0, body: commentBody.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-post', id] });
      setCommentBody('');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteForumComment(commentId, user?.user_id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-post', id] });
    },
  });

  if (isLoading) return <Loading />;

  if (isError || !post) {
    return (
      <div className='max-w-2xl mx-auto py-8'>
        <p className='text-destructive text-sm'>Post not found.</p>
        <Button variant='link' asChild className='mt-2 px-0'>
          <Link to='/forum'>Back to Forum</Link>
        </Button>
      </div>
    );
  }

  const comments: ForumComment[] = post.comments ?? [];

  return (
    <div className='max-w-2xl mx-auto py-6'>
      <Button variant='ghost' size='sm' asChild className='mb-4 gap-1.5 -ml-2'>
        <Link to='/forum'>
          <ArrowLeft className='w-4 h-4' />
          Back to Forum
        </Link>
      </Button>

      {/* Post header */}
      <div className='mb-4'>
        <div className='flex items-start justify-between gap-3'>
          <h1 className='text-2xl font-bold leading-snug'>{post.title}</h1>
          {user?.user_id === post.user_id && (
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 text-muted-foreground hover:text-destructive'
              disabled={deletePostMutation.isPending}
              onClick={() => deletePostMutation.mutate()}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground'>
          <Link
            to={`/users/${post.user_id}`}
            className='font-medium text-foreground hover:text-primary transition-colors'
          >
            {post.user_name}
          </Link>
          <span>·</span>
          <span className='flex items-center gap-1'>
            <CalendarDays className='w-3.5 h-3.5' />
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {post.park_name && (
            <>
              <span>·</span>
              <Badge variant='secondary' className='gap-1 text-xs'>
                <TreePine className='w-3 h-3' />
                {post.park_name}
              </Badge>
            </>
          )}
        </div>
      </div>

      <p className='text-base leading-relaxed whitespace-pre-wrap mb-6'>{post.body}</p>

      <Separator />

      {/* Comments */}
      <div className='mt-4'>
        <h2 className='font-semibold flex items-center gap-2 mb-1'>
          <MessageSquare className='w-4 h-4' />
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>

        {comments.length === 0 && (
          <p className='text-sm text-muted-foreground py-4'>
            No comments yet. Be the first to reply!
          </p>
        )}

        <div className='divide-y'>
          {comments.map((c) => (
            <CommentItem
              key={c.comment_id}
              comment={c}
              canDelete={user?.user_id === c.user_id}
              onDelete={() => deleteCommentMutation.mutate(c.comment_id)}
            />
          ))}
        </div>

        {/* Add comment */}
        <div className='mt-4'>
          {user ? (
            <div className='flex gap-3 items-start'>
              <div className='w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-1'>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className='flex-1 space-y-2'>
                <Textarea
                  placeholder='Write a comment…'
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  rows={3}
                />
                {addCommentMutation.isError && (
                  <p className='text-xs text-destructive'>Failed to post comment.</p>
                )}
                <Button
                  size='sm'
                  className='gap-1.5'
                  disabled={!commentBody.trim() || addCommentMutation.isPending}
                  onClick={() => addCommentMutation.mutate()}
                >
                  <Send className='w-3.5 h-3.5' />
                  {addCommentMutation.isPending ? 'Posting…' : 'Reply'}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setAuthPromptOpen(true)}
            >
              Sign in to comment
            </Button>
          )}
        </div>
      </div>

      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        message='Sign in to join the discussion.'
      />
    </div>
  );
}

export default ForumPost;
