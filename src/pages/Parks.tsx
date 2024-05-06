import { createPark, getParks } from '@/api/parks';
import Loading from '@/components/Loading';
import ParkCard from '@/components/ParkCard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateMinLength } from '@/lib/form-validations';
import { IPark } from '@/models/park.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: validateMinLength(2, 'Name must be at least 2 characters.'),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  description: validateMinLength(
    5,
    'Description must be at least 5 characters.'
  ),
  establishedDate: z.string(),
  website: z.string().url({ message: 'Invalid website URL.' }),
  entranceInfo: z.string(),
});

function Parks() {
  const { data, isLoading } = useQuery({
    queryKey: ['parks'],
    queryFn: getParks,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      establishedDate: '',
      website: '',
      entranceInfo: '',
    },
  });

  const { setQueryData, invalidateQueries } = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createPark,
    onSuccess: (data) => {
      setQueryData(['parks', data.id], data);
      invalidateQueries({ queryKey: ['parks'], exact: true });
    },
  });

  const onSubmit = ({
    name,
    location,
    description,
    establishedDate,
    website,
    entranceInfo,
  }: z.infer<typeof formSchema>) => {
    mutate({
      name,
      location,
      description,
      established_date: new Date(establishedDate).toISOString(),
      website,
      entrance_info: entranceInfo,
    });
  };

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
      <div className='flex mb-7 justify-between'>
        <ul className='flex flex-wrap gap-4 justify-between w-2/3'>
          {data.parks.map(
            ({ park_id, name, description, location, website }: IPark) => (
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
        <div className='w-1/4'>
          <h3 className='text-xl font-bold text-text mb-7'>New Park</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Enter location' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder='Enter description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='establishedDate'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-x-3'>
                    <FormLabel>Established Date</FormLabel>
                    <FormControl>
                      <Input placeholder='2000-04-23' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-x-3'>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Parks;
