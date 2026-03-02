import { getFollowStatus, followUser, unfollowUser } from '@/api/follows';
import { getParkReviewsByUser } from '@/api/park-reviews';
import { getUser } from '@/api/users';
import { getWishlistsByUserId } from '@/api/wishlist';
import Loading from '@/components/Loading';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import type { ParkReview } from '@/types/parkReview';
import type { Wishlist } from '@/types/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  CalendarDays,
  Lock,
  MapPin,
  TreePine,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ReviewItem({ review }: { review: ParkReview }) {
  return (
    <div className='border rounded-lg p-3 space-y-1.5'>
      <div className='flex items-center justify-between'>
        <StarRating value={Math.round(Number(review.rating))} readonly size='sm' />
        {review.visit_date && (
          <span className='text-xs text-muted-foreground flex items-center gap-1'>
            <CalendarDays className='w-3 h-3' />
            {new Date(review.visit_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
      </div>
      {review.comment && <p className='text-sm text-muted-foreground'>{review.comment}</p>}
    </div>
  );
}

function WishlistItem({ wishlist }: { wishlist: Wishlist }) {
  return (
    <div className='border rounded-lg p-3 flex items-center gap-3'>
      <MapPin className='w-4 h-4 text-muted-foreground shrink-0' />
      <div>
        <p className='text-sm font-medium'>Park #{wishlist.park_id}</p>
        {wishlist.planned_date_start && (
          <p className='text-xs text-muted-foreground'>
            Planned: {new Date(wishlist.planned_date_start).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

function PrivateLock({ name }: { name: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground'>
      <Lock className='w-10 h-10' />
      <p className='font-semibold text-foreground'>This account is private</p>
      <p className='text-sm text-center max-w-xs'>
        Follow {name} to see their passport, wishlist, and reviews.
      </p>
    </div>
  );
}

function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const targetId = Number(userId);
  const isOwnProfile = currentUser?.user_id === targetId;

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user', targetId],
    queryFn: () => getUser(targetId),
    enabled: !!targetId,
  });

  const { data: followStatusData } = useQuery({
    queryKey: ['follow-status', currentUser?.user_id, targetId],
    queryFn: () => getFollowStatus(currentUser?.user_id ?? 0, targetId),
    enabled: !!currentUser && !isOwnProfile && !!targetId,
  });

  const isFollowing = followStatusData?.is_following ?? false;
  const canView = !profile?.is_private || isOwnProfile || isFollowing;

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['park-reviews', 'user', targetId, currentUser?.user_id],
    queryFn: () =>
      getParkReviewsByUser(targetId, currentUser?.user_id).catch((err) => {
        if (err?.response?.status === 403) return { park_reviews: [] as ParkReview[] };
        throw err;
      }),
    enabled: !!targetId && canView,
    staleTime: 5 * 60 * 1000,
  });

  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlists', targetId, currentUser?.user_id],
    queryFn: () =>
      getWishlistsByUserId(targetId, currentUser?.user_id).catch((err) => {
        if (err?.response?.status === 403) return { wishlists: [] as Wishlist[] };
        throw err;
      }),
    enabled: !!targetId && canView,
    staleTime: 5 * 60 * 1000,
  });

  const followMutation = useMutation({
    mutationFn: () => followUser(currentUser?.user_id ?? 0, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', currentUser?.user_id, targetId] });
      queryClient.invalidateQueries({ queryKey: ['user', targetId] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(currentUser?.user_id ?? 0, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', currentUser?.user_id, targetId] });
      queryClient.invalidateQueries({ queryKey: ['user', targetId] });
    },
  });

  if (profileLoading) return <Loading />;

  if (!profile) {
    return (
      <p className='text-destructive text-sm'>User not found.</p>
    );
  }

  const reviews: ParkReview[] = reviewsData?.park_reviews ?? [];
  const wishlists: Wishlist[] = wishlistData?.wishlists ?? [];
  const visitedParkIds = new Set(reviews.map((r) => r.park_id));
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const errorMessage =
    axios.isAxiosError(followMutation.error) && followMutation.error.response?.data?.message
      ? followMutation.error.response.data.message
      : null;

  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
      <Card className='overflow-hidden mb-6'>
        <div className='h-20 bg-gradient-to-br from-primary/80 to-primary' />
        <CardContent className='pt-0 pb-6'>
          <div className='-mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-end gap-3'>
              <div className='w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-md shrink-0'>
                {getInitials(profile.name)}
              </div>
              <div className='pb-1'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-xl font-bold'>{profile.name}</h2>
                  {profile.is_private && (
                    <Lock className='w-4 h-4 text-muted-foreground' />
                  )}
                </div>
                <p className='text-sm text-muted-foreground'>{profile.email}</p>
                <Badge variant='outline' className='mt-1 gap-1 text-xs'>
                  <CalendarDays className='w-3 h-3' />
                  Member since{' '}
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Badge>
              </div>
            </div>

            {!isOwnProfile && currentUser && (
              <div className='flex flex-col gap-1'>
                <Button
                  size='sm'
                  variant={isFollowing ? 'outline' : 'default'}
                  disabled={isPending}
                  className='gap-1.5'
                  onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
                >
                  {isFollowing ? (
                    <><UserMinus className='w-3.5 h-3.5' /> Unfollow</>
                  ) : (
                    <><UserPlus className='w-3.5 h-3.5' /> Follow</>
                  )}
                </Button>
                {errorMessage && (
                  <p className='text-xs text-destructive'>{errorMessage}</p>
                )}
              </div>
            )}

            {isOwnProfile && (
              <Button size='sm' variant='outline' asChild>
                <Link to='/account'>Edit profile</Link>
              </Button>
            )}
          </div>

          <div className='flex gap-6 mt-4 text-sm'>
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Users className='w-4 h-4' />
              <span><strong className='text-foreground'>{profile.follower_count ?? 0}</strong> followers</span>
            </div>
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <span><strong className='text-foreground'>{profile.following_count ?? 0}</strong> following</span>
            </div>
            {canView && (
              <div className='flex items-center gap-1.5 text-muted-foreground'>
                <TreePine className='w-4 h-4' />
                <span><strong className='text-foreground'>{visitedParkIds.size}</strong> parks visited</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!canView ? (
        <PrivateLock name={profile.name} />
      ) : (
        <Tabs defaultValue='reviews'>
          <TabsList className='mb-4'>
            <TabsTrigger value='reviews'>Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value='passport'>Passport ({visitedParkIds.size})</TabsTrigger>
            <TabsTrigger value='wishlist'>Wishlist ({wishlists.length})</TabsTrigger>
          </TabsList>

          <TabsContent value='reviews'>
            {reviewsLoading ? (
              <Loading />
            ) : reviews.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No reviews yet.</p>
            ) : (
              <div className='space-y-2'>
                {reviews.map((r) => <ReviewItem key={r.park_review_id} review={r} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value='passport'>
            {reviewsLoading ? (
              <Loading />
            ) : visitedParkIds.size === 0 ? (
              <p className='text-sm text-muted-foreground'>No parks visited yet.</p>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {[...visitedParkIds].map((parkId) => (
                  <div
                    key={parkId}
                    className='border rounded-lg p-3 flex flex-col items-center gap-2 bg-primary/5'
                  >
                    <TreePine className='w-6 h-6 text-primary' />
                    <p className='text-xs font-medium text-center'>Park #{parkId}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='wishlist'>
            {wishlistLoading ? (
              <Loading />
            ) : wishlists.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No wishlist items yet.</p>
            ) : (
              <div className='space-y-2'>
                {wishlists.map((w) => <WishlistItem key={w.wishlist_id} wishlist={w} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default UserProfile;
