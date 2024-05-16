import { getActivities } from '@/api/activities';
import Loading from '@/components/Loading';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';

function Activities() {
  const { data, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const onEdit = (id: number) => {
    console.log(id);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <ul className='list-disc'>
      {data.activities.map(
        ({
          activity_id,
          name,
          description,
          duration,
          difficulty,
          require_special_equipment,
        }: Activity) => (
          <div className='flex gap-x-2 items-center' key={activity_id}>
            <li>
              <span>{name} |</span>
              <span>{description} |</span>
              <span>duration: {duration} |</span>
              <span>difficulty: {difficulty} |</span>
              {require_special_equipment && (
                <span>Special Equiment Required</span>
              )}
            </li>
            <Pencil
              className='w-4 h-4'
              onClick={() => {
                onEdit(activity_id!);
              }}
            />
          </div>
        )
      )}
    </ul>
  );
}

export default Activities;
