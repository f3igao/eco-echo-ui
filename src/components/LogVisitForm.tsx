import { createParkReview } from '@/api/park-reviews';
import { PARK_REVIEWS_USER_QUERY_KEY } from '@/hooks/useParkReviews';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  visit_date: z.string().min(1, 'Visit date is required.'),
  rating: z.number().min(1, 'Please select a rating.').max(5),
  comment: z.string().optional(),
  activities: z.string().optional(),
  media_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  is_private: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface LogVisitFormProps {
  parkId: number;
  onSuccess: () => void;
}

function LogVisitForm({ parkId, onSuccess }: LogVisitFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [succeeded, setSucceeded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: today,
      rating: 0,
      comment: '',
      activities: '',
      media_url: '',
      is_private: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const mediaUrl = values.media_url || undefined;

      return createParkReview({
        park_id: parkId,
        user_id: user?.user_id ?? 0,
        rating: values.rating,
        visit_date: values.visit_date,
        comment: values.comment ?? '',
        activities: values.activities || null,
        ...(mediaUrl ? { media_url: mediaUrl } : {}),
        is_private: values.is_private,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['park-reviews', parkId] });
      queryClient.invalidateQueries({ queryKey: PARK_REVIEWS_USER_QUERY_KEY(user?.user_id ?? 0) });
      setSucceeded(true);
      setTimeout(() => {
        setSucceeded(false);
        onSuccess();
      }, 1500);
    },
  });

  if (succeeded) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-8 text-primary'>
        <CheckCircle2 className='w-10 h-10' />
        <p className='font-semibold'>Visit logged!</p>
      </div>
    );
  }

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
                <Input type='date' max={today} {...field} />
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
              <FormLabel>
                Notes{' '}
                <span className='text-muted-foreground font-normal'>(optional)</span>
              </FormLabel>
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

        <FormField
          control={form.control}
          name='activities'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Activities{' '}
                <span className='text-muted-foreground font-normal'>(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='What did you do? e.g. hiking, bird watching, kayaking...'
                  className='resize-none'
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='media_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Photo URL{' '}
                <span className='text-muted-foreground font-normal'>(optional)</span>
              </FormLabel>
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
