import { createActivity, getActivities } from '@/api/activities';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  validateMaxDuration,
  validateMinLength,
  validateRange,
} from '@/lib/form-validations';
import { Activity } from '@/types/activity';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

function Activities() {
  const { data, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

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

  const onEdit = (id: number) => {
    console.log(id);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <h2 className='text-3xl font-bold text-text mb-7'>Activities</h2>
      <div className='flex mb-7 justify-between'>
        <ul className='w-2/3 list-disc'>
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
        <div className='w-1/4'>
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
                      <Input
                        placeholder='Enter duration of activity'
                        {...field}
                      />
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
        </div>
      </div>
    </>
  );
}

export default Activities;
