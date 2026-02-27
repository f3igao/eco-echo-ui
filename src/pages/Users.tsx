import { getUsers } from '@/api/users';
import Loading from '@/components/Loading';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className='text-destructive text-sm'>
        Failed to load users. Please try again later.
      </p>
    );

  const users: User[] = Array.isArray(data) ? data : (data?.users ?? []);

  return (
    <>
      <h2 className='text-3xl font-bold text-text mb-7'>Users</h2>
      <ul className='list-disc'>
        {users.map(({ user_id, name, email }) => (
          <li key={user_id} className='flex gap-x-2 items-center'>
            <span>{name} |</span>
            <span>{email}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Users;
