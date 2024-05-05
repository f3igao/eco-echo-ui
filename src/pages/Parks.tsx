import { getParks } from '@/api/parks';
import Loading from '@/components/Loading';
import ParkCard from '@/components/ParkCard';
import { Button } from '@/components/ui/button';
import { IPark } from '@/models/park.interface';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

function Parks() {
  const { data, isLoading } = useQuery({
    queryKey: ['parks'],
    queryFn: getParks,
  });

  // const newParkMutation = useMutation({
  //   mutationFn: (name: string) => {
  //     return MOCK_PARKS.push({
  //       name,
  //       location: 'Somewhere',
  //       description: 'Something.',
  //       established_date: '1995-10-09',
  //       size: 51229,
  //       visitor_count: 285515,
  //       website: 'https://www.park.com',
  //       entrance_info: 'Voluptatum doloremque non ad incidunt ut enim sunt.',
  //       created_at: '2019-02-23 07:53:50',
  //       updated_at: '2019-10-02 03:35:36',
  //     });
  //   },
  // });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className='flex gap-x-4 items-center mb-7'>
        <h2 className='text-3xl font-bold text-text'>Parks</h2>
        <Button className='rounded-full h-8 w-8 p-0 bg-accent'>
          <Plus />
        </Button>
      </div>
      <ol className='flex flex-wrap gap-4 justify-between'>
        {data.parks.map(
          ({ park_id, name, description, location, website }: IPark) => (
            <ParkCard
              key={park_id}
              name={name}
              description={description}
              location={location}
              website={website}
            ></ParkCard>
          )
        )}
      </ol>
    </>
  );
}

export default Parks;
