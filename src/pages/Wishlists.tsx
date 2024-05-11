import { getWishlists } from '@/api/wishlists';
import Loading from '@/components/Loading';
import { Wishlist } from '@/types/wishlist';
import { useQuery } from '@tanstack/react-query';

function Wishlists() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlists'],
    queryFn: getWishlists,
  });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <h2 className='text-3xl font-bold text-text mb-7'>Wishlists</h2>
      <ol className='w-2/3 list-decimal'>
        {data.wishlists.map(
          ({ wishlist_id, user_id, activity_id }: Wishlist) => (
            <li key={wishlist_id}>
              <span className='mr-3'>User ID: {user_id}</span>
              <span>Activity ID: {activity_id}</span>
            </li>
          )
        )}
      </ol>
    </>
  );
}

export default Wishlists;
