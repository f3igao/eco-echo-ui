import { getParks } from '@/api/parks';
import ParkCard from '@/components/ParkCard';
import ParkCardSkeleton from '@/components/ParkCardSkeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

const PAGE_SIZE = 12;
const SKELETON_KEYS = Array.from({ length: PAGE_SIZE }, (_, i) => `sk-${i}`);

function Parks() {
  const { ref: sentinelRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '300px',
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['parks'],
      queryFn: ({ pageParam }) => getParks({ limit: PAGE_SIZE, offset: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.flatMap((p) => p.parks).length;
        return lastPage.parks.length === PAGE_SIZE ? loaded : undefined;
      },
      staleTime: 5 * 60 * 1000,
    });

  const { isWishlisted, toggleWishlist, isToggling } = useWishlists(MOCK_USER_ID);

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const parks = data?.pages.flatMap((p) => p.parks) ?? [];

  return (
    <>
      <ol className='flex flex-wrap gap-6 px-10'>
        {isLoading
          ? SKELETON_KEYS.map((key) => (
              <li key={key}>
                <ParkCardSkeleton />
              </li>
            ))
          : parks.map((park: Park, index: number) => (
              <li key={park.park_id}>
                <ParkCard
                  index={index + 1}
                  park={park}
                  wishlisted={isWishlisted(park.park_id)}
                  onToggleWishlist={() => toggleWishlist(park.park_id)}
                  isToggling={isToggling}
                />
              </li>
            ))}
        {isFetchingNextPage &&
          SKELETON_KEYS.slice(0, 4).map((key) => (
            <li key={`next-${key}`}>
              <ParkCardSkeleton />
            </li>
          ))}
      </ol>
      <div ref={sentinelRef} />
    </>
  );
}

export default Parks;
