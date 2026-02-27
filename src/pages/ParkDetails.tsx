import { getParkReviewsByPark } from '@/api/park-reviews';
import LogVisitForm from '@/components/LogVisitForm';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Park } from '@/types/park';
import type { ParkReview } from '@/types/parkReview';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, CalendarDays, MapPin, Trees } from 'lucide-react';
import { useState } from 'react';

interface ParkDetailsProps {
  park: Park;
}

function ReviewCard({ review }: { review: ParkReview }) {
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
      {review.comment && (
        <p className='text-sm text-muted-foreground'>{review.comment}</p>
      )}
    </div>
  );
}

function ParkDetails({ park }: ParkDetailsProps) {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['park-reviews', park.park_id],
    queryFn: () =>
      getParkReviewsByPark(park.park_id).catch((err) => {
        if (err?.response?.status === 404) return { park_reviews: [] };
        throw err;
      }),
    staleTime: 5 * 60 * 1000,
  });

  const reviews: ParkReview[] = data?.park_reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <div className='flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1'>
      <DialogHeader>
        <DialogTitle className='text-xl'>{park.name}</DialogTitle>
        <DialogDescription className='flex items-center gap-1'>
          <MapPin className='w-3.5 h-3.5 shrink-0' />
          {park.location}
        </DialogDescription>
      </DialogHeader>

      <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground'>
        <span className='flex items-center gap-1'>
          <CalendarDays className='w-3.5 h-3.5' />
          Est. {park.established_date}
        </span>
        {park.size && (
          <span className='flex items-center gap-1'>
            <Trees className='w-3.5 h-3.5' />
            {park.size.toLocaleString()} acres
          </span>
        )}
        {park.visitor_count && (
          <span>{park.visitor_count.toLocaleString()} annual visitors</span>
        )}
      </div>

      <p className='text-sm leading-relaxed'>{park.description}</p>

      <div className='flex flex-wrap gap-3 text-sm'>
        <span className='text-muted-foreground'>{park.entrance_info}</span>
        <a
          href={park.website}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-0.5 text-primary hover:underline'
        >
          Official site
          <ArrowUpRight className='w-3.5 h-3.5' />
        </a>
      </div>

      <div className='border-t pt-4'>
        {showForm ? (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Log a visit</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
            <LogVisitForm
              parkId={park.park_id}
              onSuccess={() => setShowForm(false)}
            />
          </div>
        ) : (
          <Button onClick={() => setShowForm(true)} className='w-full'>
            Log a visit
          </Button>
        )}
      </div>

      {!showForm && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>
              Reviews{' '}
              {reviews.length > 0 && (
                <span className='text-muted-foreground font-normal text-sm'>
                  ({reviews.length})
                </span>
              )}
            </h3>
            {avgRating > 0 && (
              <div className='flex items-center gap-1.5'>
                <StarRating value={Math.round(avgRating)} readonly size='sm' />
                <span className='text-sm text-muted-foreground'>
                  {avgRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {isLoading && (
            <p className='text-sm text-muted-foreground'>Loading reviews...</p>
          )}

          {!isLoading && reviews.length === 0 && (
            <p className='text-sm text-muted-foreground'>
              No reviews yet. Be the first to log a visit!
            </p>
          )}

          <div className='space-y-2'>
            {reviews.map((review) => (
              <ReviewCard key={review.park_review_id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParkDetails;
