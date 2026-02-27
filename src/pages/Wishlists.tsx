import { getPark } from '@/api/parks';
import Loading from '@/components/Loading';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import type { Wishlist } from '@/types/wishlist';
import { useQueries } from '@tanstack/react-query';
import { Bookmark, BookmarkX, MapPin, Trees } from 'lucide-react';
import ParkDetails from './ParkDetails';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

function WishlistCard({ wishlist, park }: { wishlist: Wishlist; park: Park | undefined }) {
  const { toggleWishlist, isToggling } = useWishlists(MOCK_USER_ID);

  if (!park) {
    return (
      <div className='flex items-center gap-3 rounded-lg border bg-card p-4 text-muted-foreground text-sm'>
        Loading park...
      </div>
    );
  }

  return (
    <Dialog>
      <div className='flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow'>
        <div className='flex-1 min-w-0'>
            <DialogTrigger asChild>
            <button type='button' className='text-left w-full'>
              <p className='font-semibold text-text hover:text-primary transition-colors truncate'>
                {park.name}
              </p>
              <p className='text-sm text-muted-foreground flex items-center gap-1 mt-0.5'>
                <MapPin className='w-3 h-3 shrink-0' />
                {park.location}
              </p>
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
          <BookmarkX className='w-5 h-5' />
        </button>
      </div>
      <DialogContent className='max-w-[640px]'>
        <ParkDetails park={park} />
      </DialogContent>
    </Dialog>
  );
}

function Wishlists() {
  const { wishlists, isLoading } = useWishlists(MOCK_USER_ID);

  const parkQueries = useQueries({
    queries: wishlists.map((w) => ({
      queryKey: ['parks', w.park_id],
      queryFn: () => getPark(w.park_id).then((res: { park: Park }) => res.park ?? res),
      staleTime: 10 * 60 * 1000,
      enabled: wishlists.length > 0,
    })),
  });

  if (isLoading) return <Loading />;

  return (
    <div className='max-w-2xl mx-auto py-8'>
      <div className='flex items-center gap-3 mb-6'>
        <Bookmark className='w-6 h-6 text-primary' />
        <h2 className='text-2xl font-bold text-text'>My Wishlist</h2>
        {wishlists.length > 0 && (
          <span className='text-sm text-muted-foreground'>({wishlists.length} park{wishlists.length !== 1 ? 's' : ''})</span>
        )}
      </div>

      {wishlists.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
          <Trees className='w-10 h-10 text-muted-foreground' />
          <p className='text-muted-foreground'>
            No parks on your wishlist yet.
          </p>
          <p className='text-sm text-muted-foreground'>
            Browse parks and click the{' '}
            <Bookmark className='w-3.5 h-3.5 inline-block' /> bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {wishlists.map((wishlist, i) => (
            <WishlistCard
              key={wishlist.wishlist_id}
              wishlist={wishlist}
              park={parkQueries[i]?.data as Park | undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlists;
