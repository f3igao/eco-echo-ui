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
    <>
      {/* <div className='flex gap-x-4 items-center mb-7'>
        <h2 className='text-3xl font-bold text-text'>Parks</h2>
        <Button className='rounded-full h-8 w-8 p-0 bg-accent'>
          <Plus />
        </Button>
      </div> */}
      <h2 className='text-3xl font-bold text-text'>Parks</h2>
      {/* <div className='flex my-7 justify-between'> */}
      <ul className='flex flex-wrap gap-4 justify-between w-2/3'>
        {data.parks.map(
          ({ park_id, name, description, location, website }: Park) => (
            <ParkCard
              key={park_id}
              name={name}
              description={description}
              location={location}
              website={website}
              id={park_id!}
            ></ParkCard>
          )
        )}
      </ul>
      {/* </div> */}
    </>
  );
}

export default Parks;
