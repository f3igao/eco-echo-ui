import { createActivityReview } from '@/api/activity-reviews';
import { getActivitiesByPark } from '@/api/activities';
import { createParkReview } from '@/api/park-reviews';
import { StarRating } from '@/components/StarRating';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Activity } from '@/types/activity';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MOCK_USER_ID = 1;

const formSchema = z.object({
  visit_date: z.string().min(1, 'Visit date is required.'),
  rating: z.number().min(1, 'Please select a rating.').max(5),
  comment: z.string().optional(),
  media_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  is_private: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ActivityEntry {
  checked: boolean;
  rating: number;
}

interface LogVisitFormProps {
  parkId: number;
  onSuccess: () => void;
}

function LogVisitForm({ parkId, onSuccess }: LogVisitFormProps) {
  const queryClient = useQueryClient();
  const [activityEntries, setActivityEntries] = useState<Record<number, ActivityEntry>>({});

  const { data: activitiesData } = useQuery({
    queryKey: ['activities', 'park', parkId],
    queryFn: () => getActivitiesByPark(parkId),
    staleTime: 5 * 60 * 1000,
  });

  const activities: Activity[] = activitiesData?.activities ?? [];

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: today,
      rating: 0,
      comment: '',
      media_url: '',
      is_private: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const parkReview = await createParkReview({
        park_id: parkId,
        user_id: MOCK_USER_ID,
        rating: String(values.rating),
        visit_date: values.visit_date,
        comment: values.comment ?? '',
        media_url: values.media_url || null,
        is_private: values.is_private,
        updated_at: new Date().toISOString(),
        park_review_id: 0,
      });

      const checkedActivities = Object.entries(activityEntries).filter(
        ([, entry]) => entry.checked
      );

      await Promise.all(
        checkedActivities.map(([activityId, entry]) =>
          createActivityReview({
            activity_id: Number(activityId),
            user_id: MOCK_USER_ID,
            rating: entry.rating || values.rating,
            comment: values.comment,
            media_url: values.media_url || null,
            is_private: values.is_private,
          })
        )
      );

      return parkReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['park-reviews', parkId] });
      onSuccess();
    },
  });

  const toggleActivity = (activityId: number, checked: boolean) => {
    setActivityEntries((prev) => ({
      ...prev,
      [activityId]: { checked, rating: prev[activityId]?.rating ?? 0 },
    }));
  };

  const setActivityRating = (activityId: number, rating: number) => {
    setActivityEntries((prev) => ({
      ...prev,
      [activityId]: { checked: prev[activityId]?.checked ?? true, rating },
    }));
  };

  const watchedRating = form.watch('rating');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className='space-y-5'
      >
        <FormField
          control={form.control}
          name='visit_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit date</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall rating</FormLabel>
              <FormControl>
                <div>
                  <StarRating
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='What made this visit memorable?'
                  className='resize-none'
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {activities.length > 0 && (
          <div className='space-y-2'>
            <Label>Activities done</Label>
            <div className='space-y-2 rounded-md border p-3'>
              {activities.map((activity) => {
                const id = activity.activity_id ?? 0;
                const entry = activityEntries[id];
                return (
                  <div key={id} className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        id={`activity-${id}`}
                        checked={entry?.checked ?? false}
                        onCheckedChange={(checked) =>
                          toggleActivity(id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`activity-${id}`}
                        className='text-sm font-medium leading-none cursor-pointer'
                      >
                        {activity.name}
                      </label>
                    </div>
                    {entry?.checked && (
                      <div className='ml-6 flex items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>Rating:</span>
                        <StarRating
                          size='sm'
                          value={entry.rating || watchedRating}
                          onChange={(v) => setActivityRating(id, v)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name='media_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL <span className='text-muted-foreground font-normal'>(optional)</span></FormLabel>
              <FormControl>
                <Input placeholder='https://...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='is_private'
          render={({ field }) => (
            <FormItem className='flex items-center gap-2'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <FormLabel className='!mt-0'>Keep this visit private</FormLabel>
            </FormItem>
          )}
        />

        {mutation.isError && (
          <p className='text-sm text-destructive'>
            Failed to log visit. Please try again.
          </p>
        )}

        <Button type='submit' disabled={mutation.isPending} className='w-full'>
          {mutation.isPending ? 'Saving...' : 'Log visit'}
        </Button>
      </form>
    </Form>
  );
}

export default LogVisitForm;
