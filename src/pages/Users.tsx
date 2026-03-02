import { followUser, getFollowing, unfollowUser } from '@/api/follows';
import { getUsers } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import type { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, UserMinus, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function UserCard({
  user,
  isFollowing,
  isPending,
  onFollow,
  onUnfollow,
  isOwnProfile,
}: {
  user: User;
  isFollowing: boolean;
  isPending: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  isOwnProfile: boolean;
}) {
  return (
    <div className='flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/30 transition-colors'>
      <Link
        to={`/users/${user.user_id}`}
        className='flex items-center gap-3 flex-1 min-w-0'
      >
        <div className='w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0'>
          {getInitials(user.name)}
        </div>
        <div className='min-w-0'>
          <p className='font-medium truncate'>{user.name}</p>
          <p className='text-sm text-muted-foreground truncate'>{user.email}</p>
        </div>
      </Link>

      {!isOwnProfile && (
        <Button
          size='sm'
          variant={isFollowing ? 'outline' : 'default'}
          disabled={isPending}
          className='ml-4 gap-1.5 shrink-0'
          onClick={isFollowing ? onUnfollow : onFollow}
        >
          {isFollowing ? (
            <><UserMinus className='w-3.5 h-3.5' /> Unfollow</>
          ) : (
            <><UserPlus className='w-3.5 h-3.5' /> Follow</>
          )}
        </Button>
      )}
    </div>
  );
}

function Users() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: followingData } = useQuery({
    queryKey: ['following', currentUser?.user_id],
    queryFn: () => getFollowing(currentUser?.user_id ?? 0),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  const followingIds = useMemo(
    () => new Set((followingData?.users ?? []).map((u) => u.user_id)),
    [followingData],
  );

  const followMutation = useMutation({
    mutationFn: (targetId: number) =>
      followUser(currentUser?.user_id ?? 0, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?.user_id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetId: number) =>
      unfollowUser(currentUser?.user_id ?? 0, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?.user_id] });
    },
  });

  const pendingId =
    followMutation.isPending
      ? (followMutation.variables as number)
      : unfollowMutation.isPending
        ? (unfollowMutation.variables as number)
        : null;

  const users: User[] = useMemo(() => {
    const all: User[] = Array.isArray(data) ? data : (data?.users ?? []);
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7'>
        <h2 className='text-3xl font-bold text-text'>Users</h2>
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <Input
            className='pl-9'
            placeholder='Search by name or email…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <p className='text-sm text-muted-foreground'>Loading users…</p>
      )}

      {isError && (
        <p className='text-destructive text-sm'>
          Failed to load users. Please try again later.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {users.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No users found.</p>
          ) : (
            <div className='flex flex-col gap-2'>
              {users.map((u) => (
                <UserCard
                  key={u.user_id}
                  user={u}
                  isFollowing={followingIds.has(u.user_id)}
                  isPending={pendingId === u.user_id}
                  isOwnProfile={currentUser?.user_id === u.user_id}
                  onFollow={() => followMutation.mutate(u.user_id)}
                  onUnfollow={() => unfollowMutation.mutate(u.user_id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Users;
