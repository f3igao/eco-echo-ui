import { getUsers } from '@/api/users';
import Loading from '@/components/Loading';
import { IUser } from '@/models/user.interface';
import { useQuery } from '@tanstack/react-query';

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <h2 className='text-3xl font-bold text-text mb-7'>Users</h2>
      <ol className='w-2/3 list-decimal'>
        {data.users.map(({ user_id, name, email }: IUser) => (
          <li key={user_id}>
            <span className='mr-3'>{name}</span>
            <span>{email}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

export default Users;
