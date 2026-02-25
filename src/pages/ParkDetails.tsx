import { getParkReviewsByPark } from '@/api/park-reviews';
import { useQuery } from '@tanstack/react-query';

function ParkDetails() {
  const { data, isLoading } = useQuery({
    queryKey: ['park-reviews', 1],
    queryFn: () => getParkReviewsByPark(1),
  });

  console.log(data?.park_reviews);

  return (
    <div className='flex flex-col items-center justify-center gap-y-3'>
      <h2>ParkDetails Page</h2>
    </div>
  );
}

export default ParkDetails;
