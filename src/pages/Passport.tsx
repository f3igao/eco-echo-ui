import { getParkReviewsByUser } from '@/api/park-reviews';
import { getPark } from '@/api/parks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Park } from '@/types/park';
import type { ParkReview } from '@/types/parkReview';
import { useAuth } from '@/context/AuthContext';
import { useQueries, useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Star, Trees } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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

type ViewMode = 'all-time' | 'by-year';

function PassportStamp({ stamp }: { stamp: ParkStamp }) {
  const palette = STAMP_PALETTES[stamp.colorIndex % STAMP_PALETTES.length];
  const dateObj = stamp.lastVisitDate ? new Date(stamp.lastVisitDate) : null;
  const date =
    dateObj && !Number.isNaN(dateObj.getTime())
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
        <span className='text-[9px] font-semibold text-white opacity-80'>
          {stamp.visitCount} {stamp.visitCount === 1 ? 'visit' : 'visits'} · {date}
        </span>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <Card className='text-center'>
      <CardContent className='flex flex-col items-center gap-1 p-3'>
        <div className='text-primary'>{icon}</div>
        <span className='text-xl font-bold'>{value}</span>
        <span className='text-xs text-muted-foreground leading-tight'>{label}</span>
      </CardContent>
    </Card>
  );
}

function StatsGrid({ reviews }: { reviews: ParkReview[] }) {
  const parksExplored = new Set(reviews.map((r) => r.park_id)).size;
  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0;
  return (
    <div className='grid grid-cols-3 gap-3'>
      <StatCard icon={<MapPin className='w-4 h-4' />} value={parksExplored} label='Parks Explored' />
      <StatCard icon={<CalendarDays className='w-4 h-4' />} value={reviews.length} label='Total Visits' />
      <StatCard icon={<Star className='w-4 h-4' />} value={avgRating > 0 ? avgRating.toFixed(1) : '—'} label='Avg Rating' />
    </div>
  );
}

function StampGrid({ stamps }: { stamps: ParkStamp[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className='flex flex-wrap gap-3'>
        {stamps.map((stamp) => {
          const dateObj = stamp.lastVisitDate ? new Date(stamp.lastVisitDate) : null;
          const date =
            dateObj && !Number.isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : null;
          return (
            <Tooltip key={`${stamp.parkId}-${stamp.lastVisitDate}`}>
              <TooltipTrigger asChild>
                <span>
                  <PassportStamp stamp={stamp} />
                </span>
              </TooltipTrigger>
              <TooltipContent side='top' className='space-y-1 max-w-[180px]'>
                <p className='font-semibold text-sm'>{stamp.parkName}</p>
                {stamp.location && (
                  <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <MapPin className='w-3 h-3 shrink-0' />
                    {stamp.location}
                  </p>
                )}
                <div className='flex items-center gap-2 pt-0.5'>
                  <Badge variant='secondary'>
                    {stamp.visitCount} {stamp.visitCount === 1 ? 'visit' : 'visits'}
                  </Badge>
                  {stamp.avgRating > 0 && (
                    <Badge variant='outline' className='flex items-center gap-0.5'>
                      <Star className='w-3 h-3' />
                      {stamp.avgRating.toFixed(1)}
                    </Badge>
                  )}
                </div>
                {date && (
                  <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <CalendarDays className='w-3 h-3 shrink-0' />
                    Last visit: {date}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function Passport() {
  const { user } = useAuth();
  const userId = user?.user_id;
  const [viewMode, setViewMode] = useState<ViewMode>('all-time');

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['park-reviews', 'user', userId],
    queryFn: () =>
      getParkReviewsByUser(userId as number).catch((err) => {
        if (err?.response?.status === 404) return { park_reviews: [] };
        throw err;
      }),
    enabled: !!userId,
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

  const parkIndexMap = new Map(uniqueParkIds.map((id, i) => [id, i]));

  function buildStamps(scopedReviews: ParkReview[]): ParkStamp[] {
    return [...new Set(scopedReviews.map((r) => r.park_id))]
      .map((parkId) => {
        const globalIndex = parkIndexMap.get(parkId) ?? 0;
        const park = parkQueries[globalIndex]?.data as Park | undefined;
        const parkReviews = scopedReviews.filter((r) => r.park_id === parkId);
        const lastVisitDate = [...parkReviews]
          .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0]
          ?.visit_date ?? '';
        const avgRating =
          parkReviews.reduce((s, r) => s + Number(r.rating), 0) / parkReviews.length || 0;
        return {
          parkId,
          parkName: park?.name ?? `Park #${parkId}`,
          location: park?.location ?? '',
          visitCount: parkReviews.length,
          lastVisitDate,
          avgRating,
          colorIndex: globalIndex,
        };
      })
      .sort((a, b) => new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime());
  }

  // Year range for all-time title
  const allYears = reviews
    .map((r) => new Date(r.visit_date).getFullYear())
    .filter((y) => !Number.isNaN(y));
  const minYear = allYears.length > 0 ? Math.min(...allYears) : null;
  const maxYear = allYears.length > 0 ? Math.max(...allYears) : null;
  const allTimeTitle =
    minYear === null ? 'Start your adventure!'
    : minYear === maxYear ? String(minYear)
    : `${minYear}–${maxYear}`;

  // By-year grouping
  const reviewsByYear = reviews.reduce<Record<number, ParkReview[]>>((acc, r) => {
    const y = new Date(r.visit_date).getFullYear();
    if (!Number.isNaN(y)) {
      if (!acc[y]) acc[y] = [];
      acc[y].push(r);
    }
    return acc;
  }, {});
  const years = Object.keys(reviewsByYear).map(Number).sort((a, b) => b - a);

  const headerTitle = viewMode === 'all-time' ? allTimeTitle : (years[0] ?? 'Start your adventure!');

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle className='flex items-center gap-2 text-text'>
            <Trees className='w-5 h-5 text-primary' />
            {headerTitle}
          </CardTitle>
          <div className='flex items-center rounded-md border p-0.5 gap-0.5 ml-auto'>
            <Button
              variant={viewMode === 'all-time' ? 'default' : 'ghost'}
              size='sm'
              className='h-6 px-2 text-xs'
              onClick={() => setViewMode('all-time')}
              disabled={reviews.length === 0}
            >
              All Time
            </Button>
            <Button
              variant={viewMode === 'by-year' ? 'default' : 'ghost'}
              size='sm'
              className='h-6 px-2 text-xs'
              onClick={() => setViewMode('by-year')}
              disabled={reviews.length === 0}
            >
              By Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-5'>
        {isLoading && (
          <p className='text-sm text-muted-foreground'>Loading passport...</p>
        )}

        {!isLoading && reviews.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-4 py-16 text-center'>
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <Trees className='w-8 h-8 text-primary' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>No stamps yet</h3>
              <p className='text-sm text-muted-foreground max-w-xs'>
                Log a park visit to earn your first stamp and start building your passport.
              </p>
            </div>
            <Button asChild variant='outline' className='gap-2 mt-1'>
              <Link to='/parks'>
                <MapPin className='w-4 h-4' />
                Browse parks
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && reviews.length > 0 && viewMode === 'all-time' && (
          <>
            <StatsGrid reviews={reviews} />
            <Separator />
            <StampGrid stamps={buildStamps(reviews)} />
          </>
        )}

        {!isLoading && reviews.length > 0 && viewMode === 'by-year' && years.map((year, idx) => (
          <div key={year} className='space-y-4'>
            {idx > 0 && (
              <>
                <Separator />
                <CardTitle className='flex items-center gap-2 text-text'>
                  <Trees className='w-5 h-5 text-primary' />
                  {year}
                </CardTitle>
              </>
            )}
            <StatsGrid reviews={reviewsByYear[year]} />
            <StampGrid stamps={buildStamps(reviewsByYear[year])} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default Passport;
