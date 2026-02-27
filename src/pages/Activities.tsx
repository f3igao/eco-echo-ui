import { getActivities } from '@/api/activities';
import Loading from '@/components/Loading';
import { Activity } from '@/types/activity';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';

function Activities() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
    staleTime: 5 * 60 * 1000,
  });

  const onEdit = (_id: number) => {};

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className='text-destructive text-sm'>
        Failed to load activities. Please try again later.
      </p>
    );

  const activities: Activity[] = Array.isArray(data)
    ? data
    : (data?.activities ?? []);

  return (
    <ul className='list-disc'>
      {activities.map(
        ({
          activity_id,
          name,
          description,
          duration,
          difficulty,
          require_special_equipment,
        }) => (
          <li className='flex gap-x-2 items-center' key={activity_id}>
            <span>{name} |</span>
            <span>{description} |</span>
            <span>duration: {duration} |</span>
            <span>difficulty: {difficulty} |</span>
            {require_special_equipment && (
              <span>Special Equipment Required</span>
            )}
            <Pencil
              className='w-4 h-4 cursor-pointer'
              onClick={() => onEdit(activity_id!)}
            />
          </li>
        )
      )}
    </ul>
  );
}

export default Activities;
