import { getPark } from '@/api/parks';
import Loading from '@/components/Loading';
import WishlistCard from '@/components/WishlistCard';
import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import { useQueries } from '@tanstack/react-query';
import { Bookmark, Trees } from 'lucide-react';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

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
