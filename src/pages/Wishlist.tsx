import { getPark } from '@/api/parks';
import Loading from '@/components/Loading';
import WishlistCard from '@/components/WishlistCard';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import type { Park } from '@/types/park';
import { useQueries } from '@tanstack/react-query';
import { Bookmark, Trees } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type PendingRemoval = { parkId: number; parkName: string };

function Wishlist() {
  const { user } = useAuth();
  const { wishlists, isLoading, removeWishlist } = useWishlist(user?.user_id ?? 0);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingRemoval | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  pendingRef.current = pendingRemoval;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleUndo() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setPendingRemoval(null);
    toastIdRef.current = null;
  }

  function handleRemove(parkId: number, parkName: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pendingRef.current) {
      removeWishlist(pendingRef.current.parkId);
      if (toastIdRef.current !== null) toast.dismiss(toastIdRef.current);
    }

    setPendingRemoval({ parkId, parkName });

    toastIdRef.current = toast(`Removed ${parkName} from your wishlist`, {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: handleUndo,
      },
    });

    timerRef.current = setTimeout(() => {
      removeWishlist(parkId);
      setPendingRemoval(null);
      timerRef.current = null;
      toastIdRef.current = null;
    }, 5000);
  }

  const displayedWishlists = (
    pendingRemoval ? wishlists.filter((w) => w.park_id !== pendingRemoval.parkId) : wishlists
  ).toSorted((a, b) => {
    if (!a.planned_date_start && !b.planned_date_start) return 0;
    if (!a.planned_date_start) return 1;
    if (!b.planned_date_start) return -1;
    return a.planned_date_start < b.planned_date_start ? -1 : a.planned_date_start > b.planned_date_start ? 1 : 0;
  });

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
    </div>
  );
}

export default Wishlist;
