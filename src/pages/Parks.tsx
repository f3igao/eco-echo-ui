import { getParks } from '@/api/parks';
import ParkCard from '@/components/ParkCard';
import ParkCardSkeleton from '@/components/ParkCardSkeleton';
import type { Park } from '@/types/park';
import { useQuery } from '@tanstack/react-query';

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8'];

function Parks() {
  const { data, isLoading } = useQuery({
    queryKey: ['parks'],
    queryFn: getParks,
  });

  return (
    <ol className='flex flex-wrap gap-6 px-10'>
      {isLoading
        ? SKELETON_KEYS.map((key) => (
            <li key={key}>
              <ParkCardSkeleton />
            </li>
          ))
        : data.parks.map((park: Park, index: number) => (
            <li key={park.park_id}>
              <ParkCard index={index + 1} park={park} />
            </li>
          ))}
    </ol>
  );
}

export default Parks;
