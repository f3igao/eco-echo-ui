import { createActivity } from '@/api/activities';
import {
  validateMaxDuration,
  validateMinLength,
  validateRange,
} from '@/lib/form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@radix-ui/react-checkbox';
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
  description: validateMinLength(
    5,
    'Description must be at least 5 characters.'
  ),
  duration: validateMaxDuration(48, 'Activity cannot be longer than 48 hours'),
  difficulty: validateRange(0, 10, 'Difficulty is between 0 and 10'),
  requireSpecialEquipment: z.boolean(),
  parkId: validateRange(1, 20, 'Park id must be between 1 and 20'),
});

function NewActivityForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 1,
      difficulty: 0,
      requireSpecialEquipment: false,
      parkId: 1,
    },
  });

  const { setQueryData, invalidateQueries } = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createActivity,
    onSuccess: (data) => {
      setQueryData(['activities', data.id], data);
      invalidateQueries({ queryKey: ['activities'], exact: true });
    },
  });

  const onSubmit = ({
    name,
    description,
    duration,
    difficulty,
    requireSpecialEquipment,
    parkId,
  }: z.infer<typeof formSchema>) => {
    mutate({
      name,
      description,
      duration,
      difficulty,
      require_special_equipment: requireSpecialEquipment,
      park_id: parkId,
    });
  };

  return (
    <>
      <h3 className='text-xl font-bold text-text mb-7'>New Activity</h3>
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
            name='duration'
            render={({ field }) => (
              <FormItem className='flex items-center gap-x-3'>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder='Enter duration of activity' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='difficulty'
            render={({ field }) => (
              <FormItem className='flex items-center gap-x-3'>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter difficulty'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='requireSpecialEquipment'
            render={({ field }) => (
              <FormItem className='flex items-center gap-x-3'>
                <FormLabel>Requires Special Equipment</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* TODO: add park association */}
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default NewActivityForm;
