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
    <ol className='flex flex-wrap gap-6 p-6'>
      {data.parks.map(
        (
          { park_id, name, description, location, website }: Park,
          index: number
        ) => (
          <li key={park_id}>
            <ParkCard
              index={index + 1}
              id={park_id!}
              name={name}
              description={description}
              location={location}
              website={website}
            ></ParkCard>
          </li>
        )
      )}
    </ol>
  );
}

export default Parks;
