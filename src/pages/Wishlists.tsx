import { getPark } from '@/api/parks';
import Loading from '@/components/Loading';
import WishlistCard from '@/components/WishlistCard';
import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import { useQueries } from '@tanstack/react-query';
import { Bookmark, Trees } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

type PendingRemoval = { parkId: number; parkName: string };

function Wishlists() {
  const { wishlists, isLoading, removeWishlist } = useWishlists(MOCK_USER_ID);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingRemoval | null>(null);
  pendingRef.current = pendingRemoval;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleRemove(parkId: number, parkName: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pendingRef.current) {
      removeWishlist(pendingRef.current.parkId);
    }
    setPendingRemoval({ parkId, parkName });
    timerRef.current = setTimeout(() => {
      removeWishlist(parkId);
      setPendingRemoval(null);
      timerRef.current = null;
    }, 5000);
  }

  function handleUndo() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setPendingRemoval(null);
  }

  const displayedWishlists = pendingRemoval
    ? wishlists.filter((w) => w.park_id !== pendingRemoval.parkId)
    : wishlists;

  const parkQueries = useQueries({
    queries: displayedWishlists.map((w) => ({
      queryKey: ['parks', w.park_id],
      queryFn: () => getPark(w.park_id).then((res: { park: Park }) => res.park ?? res),
      staleTime: 10 * 60 * 1000,
      enabled: displayedWishlists.length > 0,
    })),
  });

  if (isLoading) return <Loading />;

  const displayCount = displayedWishlists.length;

  return (
    <div className='max-w-2xl mx-auto py-8'>
      <div className='flex items-center gap-3 mb-6'>
        <Bookmark className='w-6 h-6 text-primary' />
        <h2 className='text-2xl font-bold text-text'>My Wishlist</h2>
        {displayCount > 0 && (
          <span className='text-sm text-muted-foreground'>
            ({displayCount} park{displayCount !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      {displayCount === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
          <Trees className='w-10 h-10 text-muted-foreground' />
          <p className='text-muted-foreground'>No parks on your wishlist yet.</p>
          <p className='text-sm text-muted-foreground'>
            Browse parks and click the{' '}
            <Bookmark className='w-3.5 h-3.5 inline-block' /> bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {displayedWishlists.map((wishlist, i) => (
            <WishlistCard
              key={wishlist.wishlist_id}
              wishlist={wishlist}
              park={parkQueries[i]?.data as Park | undefined}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {pendingRemoval && (
        <div
          key={pendingRemoval.parkId}
          className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-80 bg-card border rounded-lg shadow-lg overflow-hidden'
        >
          <div className='flex items-center justify-between gap-3 px-4 py-3'>
            <p className='text-sm text-foreground truncate'>
              Deleted <span className='font-medium'>{pendingRemoval.parkName}</span> from your wishlist
            </p>
            <button
              type='button'
              onClick={handleUndo}
              className='shrink-0 text-sm font-semibold text-primary hover:underline'
            >
              Undo
            </button>
          </div>
          <div className='h-1 bg-muted'>
            <div
              key={pendingRemoval.parkId}
              className='h-full bg-primary'
              style={{ animation: 'shrink-width 5s linear forwards' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlists;
