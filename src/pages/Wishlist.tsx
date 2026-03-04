import { getPark } from '@/api/parks';
import Loading from '@/components/Loading';
import WishlistCard from '@/components/WishlistCard';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import type { Park } from '@/types/park';
import { useQueries } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bookmark, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        <div className='flex flex-col items-center justify-center gap-4 py-20 text-center'>
          <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
            <Bookmark className='w-8 h-8 text-primary' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold'>Bookmark your next adventure</h3>
            <p className='text-sm text-muted-foreground max-w-xs'>
              Save parks you want to visit and plan your trips with dates and notes.
            </p>
          </div>
          <Button asChild variant='outline' className='gap-2 mt-1'>
            <Link to='/parks'>
              <MapPin className='w-4 h-4' />
              Browse parks
            </Link>
          </Button>
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
