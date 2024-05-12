import { createPark } from '@/api/parks';
import { validateMinLength } from '@/lib/form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import { z } from 'zod';
import { Button } from './ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

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

function NewPark() {
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

  return (
    <>
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
    </>
  );
}

export default NewPark;
