import { getParkReviewsByUser } from '@/api/park-reviews';
import { getPark } from '@/api/parks';
import { updateUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/hooks/useWishlist';
import { validateEmail, validateMinLength } from '@/lib/form-validations';
import type { Park } from '@/types/park';
import type { ParkReview } from '@/types/parkReview';
import type { Wishlist } from '@/types/wishlist';
import type { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bookmark, BookmarkX, CalendarDays, KeyRound, LogOut, Mail, MapPin, Star, Trash2, Trees, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import ParkDetails from './ParkDetails';

// TODO: replace with actual user from auth context
const MOCK_USER: User = {
  user_id: 1,
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  password: '',
  created_at: new Date('2024-03-15'),
  updated_at: new Date(),
};

const profileSchema = z.object({
  name: validateMinLength(2, 'Name must be at least 2 characters.'),
  email: validateEmail(),
});

const passwordSchema = z
  .object({
    currentPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
    newPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
    confirmPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const STAMP_PALETTES = [
  { bg: '#4A6741', border: '#3A5432' },
  { bg: '#7B5E3D', border: '#614A2E' },
  { bg: '#2E6B5C', border: '#1E5246' },
  { bg: '#8B4B2B', border: '#6D3920' },
  { bg: '#3D6275', border: '#2D4E5E' },
  { bg: '#7A5C32', border: '#614A25' },
  { bg: '#5C6B3E', border: '#49562F' },
  { bg: '#6B3D5A', border: '#552E47' },
];

type ParkStamp = {
  parkId: number;
  parkName: string;
  location: string;
  visitCount: number;
  lastVisitDate: string;
  avgRating: number;
  colorIndex: number;
};

function PassportStamp({ stamp }: { stamp: ParkStamp }) {
  const palette = STAMP_PALETTES[stamp.colorIndex % STAMP_PALETTES.length];
  const dateObj = stamp.lastVisitDate ? new Date(stamp.lastVisitDate) : null;
  const date =
    dateObj && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '';

  return (
    <div
      className='relative flex flex-col items-center justify-between rounded-lg p-2 select-none shrink-0'
      style={{
        width: 128,
        height: 128,
        background: palette.bg,
        border: `3px solid ${palette.border}`,
      }}
    >
      <div
        className='absolute inset-[6px] rounded pointer-events-none'
        style={{ border: `1.5px dashed rgba(255,255,255,0.35)` }}
      />

      <span
        className='text-[9px] font-bold tracking-[0.18em] uppercase opacity-70 mt-1 z-10'
        style={{ color: 'rgba(255,255,255,0.8)' }}
      >
        visited
      </span>

      <div className='flex flex-col items-center gap-0.5 z-10 px-2'>
        <span
          className='text-white font-bold text-center leading-tight line-clamp-2 text-[11px] tracking-wide'
          title={stamp.parkName}
        >
          {stamp.parkName}
        </span>
        <span className='text-[9px] opacity-60 text-white text-center truncate w-full' title={stamp.location}>
          {stamp.location}
        </span>
      </div>

      <div className='flex flex-col items-center gap-0.5 mb-1 z-10'>
        <span
          className='text-[9px] font-semibold text-white opacity-80'
        >
          {stamp.visitCount} {stamp.visitCount === 1 ? 'visit' : 'visits'} · {date}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className='flex flex-col items-center gap-1 rounded-lg border bg-card p-3 text-center'>
      <div className='text-primary'>{icon}</div>
      <span className='text-xl font-bold text-text'>{value}</span>
      <span className='text-xs text-muted-foreground leading-tight'>{label}</span>
    </div>
  );
}

function PassportSection({ userId }: { userId: number }) {
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['park-reviews', 'user', userId],
    queryFn: () =>
      getParkReviewsByUser(userId).catch((err) => {
        if (err?.response?.status === 404) return { park_reviews: [] };
        throw err;
      }),
    staleTime: 5 * 60 * 1000,
  });

  const reviews: ParkReview[] = reviewsData?.park_reviews ?? [];

  const uniqueParkIds = [...new Set(reviews.map((r) => r.park_id))];

  const parkQueries = useQueries({
    queries: uniqueParkIds.map((id) => ({
      queryKey: ['parks', id],
      queryFn: () => getPark(id).then((res: { park: Park }) => res.park ?? res),
      staleTime: 10 * 60 * 1000,
    })),
  });

  const stamps: ParkStamp[] = uniqueParkIds
    .map((parkId, i) => {
      const park = parkQueries[i]?.data as Park | undefined;
      const parkReviews = reviews.filter((r) => r.park_id === parkId);
      const sorted = [...parkReviews].sort(
        (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime(),
      );
      const avgRating =
        parkReviews.length > 0
          ? parkReviews.reduce((s, r) => s + Number(r.rating), 0) / parkReviews.length
          : 0;

      return {
        parkId,
        parkName: park?.name ?? `Park #${parkId}`,
        location: park?.location ?? '',
        visitCount: parkReviews.length,
        lastVisitDate: sorted[0]?.visit_date ?? '',
        avgRating,
        colorIndex: i,
      };
    })
    .sort((a, b) => new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime());

  const totalVisits = reviews.length;
  const parksExplored = uniqueParkIds.length;
  const avgRatingAll =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-text'>
          <Trees className='w-5 h-5 text-primary' /> Adventure Passport
        </CardTitle>
        <CardDescription>Your park visits and exploration stats</CardDescription>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-3 gap-3'>
          <StatCard
            icon={<MapPin className='w-4 h-4' />}
            value={parksExplored}
            label='Parks Explored'
          />
          <StatCard
            icon={<CalendarDays className='w-4 h-4' />}
            value={totalVisits}
            label='Total Visits'
          />
          <StatCard
            icon={<Star className='w-4 h-4' />}
            value={avgRatingAll > 0 ? avgRatingAll.toFixed(1) : '—'}
            label='Avg Rating'
          />
        </div>

        {isLoading && (
          <p className='text-sm text-muted-foreground'>Loading passport...</p>
        )}

        {!isLoading && stamps.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No stamps yet — log a park visit to earn your first one!
          </p>
        )}

        {stamps.length > 0 && (
          <div className='flex flex-wrap gap-3'>
            {stamps.map((stamp) => (
              <PassportStamp key={stamp.parkId} stamp={stamp} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSection({ user }: { user: User }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) =>
      updateUser(user.user_id, { ...user, ...data }),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update profile. Please try again.';
      form.setError('root', { message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-semibold shrink-0'>
            {getInitials(user.name)}
          </div>
          <div>
            <CardTitle className='text-text'>{user.name}</CardTitle>
            <CardDescription className='flex items-center gap-1.5 mt-1'>
              <CalendarDays className='w-3.5 h-3.5' />
              Member since{' '}
              {user.created_at.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1.5'>
                    <UserRound className='w-3.5 h-3.5' /> Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1.5'>
                    <Mail className='w-3.5 h-3.5' /> Email
                  </FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className='text-sm font-medium text-destructive'>
                {form.formState.errors.root.message}
              </p>
            )}
            <div className='flex items-center gap-3 pt-1'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
              {saved && (
                <span className='text-sm text-primary font-medium'>
                  Changes saved!
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [saved, setSaved] = useState(false);

  // TODO: wire up to a real change-password endpoint
  const mutation = useMutation({
    mutationFn: async (_data: z.infer<typeof passwordSchema>) => {
      await new Promise((res) => setTimeout(res, 600));
    },
    onSuccess: () => {
      form.reset();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => {
      form.setError('root', {
        message: 'Failed to change password. Please try again.',
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-text'>
          <KeyRound className='w-5 h-5' /> Change Password
        </CardTitle>
        <CardDescription>
          Choose a strong password of at least 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className='text-sm font-medium text-destructive'>
                {form.formState.errors.root.message}
              </p>
            )}
            <div className='flex items-center gap-3 pt-1'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update password'}
              </Button>
              {saved && (
                <span className='text-sm text-primary font-medium'>
                  Password updated!
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function WishlistSection({ userId }: { userId: number }) {
  const { wishlists, isLoading, toggleWishlist, isToggling } = useWishlist(userId);

  const parkQueries = useQueries({
    queries: wishlists.map((w) => ({
      queryKey: ['parks', w.park_id],
      queryFn: () => getPark(w.park_id).then((res: { park: Park }) => res.park ?? res),
      staleTime: 10 * 60 * 1000,
    })),
  });

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-text'>
          <Bookmark className='w-5 h-5 text-primary' /> Wishlist
        </CardTitle>
        <CardDescription>Parks you want to visit</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className='text-sm text-muted-foreground'>Loading wishlist...</p>
        )}

        {!isLoading && wishlists.length === 0 && (
          <p className='text-sm text-muted-foreground'>
            No parks saved yet — bookmark a park to add it here.
          </p>
        )}

        {wishlists.length > 0 && (
          <div className='flex flex-col gap-2'>
            {wishlists.map((wishlist: Wishlist, i: number) => {
              const park = parkQueries[i]?.data as Park | undefined;
              return (
                <Dialog key={wishlist.wishlist_id}>
                  <div className='flex items-center gap-3 rounded-lg border bg-background p-3'>
                    <div className='flex-1 min-w-0'>
                      <DialogTrigger asChild>
                        <button type='button' className='text-left w-full'>
                          <p className='text-sm font-medium text-text hover:text-primary transition-colors truncate'>
                            {park?.name ?? `Park #${wishlist.park_id}`}
                          </p>
                          {park?.location && (
                            <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                              <MapPin className='w-3 h-3 shrink-0' />
                              {park.location}
                            </p>
                          )}
                        </button>
                      </DialogTrigger>
                    </div>
                    <button
                      type='button'
                      onClick={() => toggleWishlist(wishlist.park_id)}
                      disabled={isToggling}
                      className='shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50'
                      title='Remove from wishlist'
                    >
                      <BookmarkX className='w-4 h-4' />
                    </button>
                  </div>
                  {park && (
                    <DialogContent className='max-w-[640px]'>
                      <ParkDetails park={park} />
                    </DialogContent>
                  )}
                </Dialog>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DangerZone() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // TODO: call deleteUser(user_id) and clear auth state
      await new Promise((res) => setTimeout(res, 600));
    },
    onSuccess: () => {
      setOpen(false);
      navigate('/');
    },
  });

  const logOut = () => {
    // TODO: clear auth tokens / session
    navigate('/login');
  };

  return (
    <Card className='border-destructive/40'>
      <CardHeader>
        <CardTitle className='text-destructive'>Danger zone</CardTitle>
        <CardDescription>
          These actions are permanent and cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col sm:flex-row gap-3'>
        <Button variant='outline' className='gap-2' onClick={logOut}>
          <LogOut className='w-4 h-4' /> Log out
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='destructive' className='gap-2'>
              <Trash2 className='w-4 h-4' /> Delete account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function Account() {
  return (
    <div className='max-w-2xl mx-auto py-8 flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-text'>Account</h2>
      <PassportSection userId={MOCK_USER.user_id} />
      <WishlistSection userId={MOCK_USER.user_id} />
      <ProfileSection user={MOCK_USER} />
      <PasswordSection />
      <DangerZone />
    </div>
  );
}

export default Account;
