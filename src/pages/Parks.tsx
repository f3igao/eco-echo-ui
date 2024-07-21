import { getParks } from '@/api/parks';
import Loading from '@/components/Loading';
import ParkCard from '@/components/ParkCard';
import { Park } from '@/types/park';
import { useQuery } from '@tanstack/react-query';

function Parks() {
  const { data, isLoading } = useQuery({
    queryKey: ['parks'],
    queryFn: getParks,
  });

  return isLoading ? (
    <Loading />
  ) : (
    <ol className='flex flex-wrap gap-6 px-10'>
      {data.parks.map((park: Park, index: number) => (
        <li key={park.park_id}>
          <ParkCard index={index + 1} park={park} />
        </li>
      ))}
    </ol>
  );
}

export default Parks;
