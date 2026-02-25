import { signUp } from '@/api/users';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validateEmail, validateMinLength } from '@/lib/form-validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  name: validateMinLength(2, 'Name must be at least 2 characters.'),
  email: validateEmail(),
  password: validateMinLength(6, 'Password must be at least 6 characters.'),
});

function SignUp() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Something went wrong. Please try again.';
      form.setError('root', { message });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className='flex flex-col justify-center h-screen items-center gap-y-8'>
      <h2 className='text-3xl font-bold text-text'>Sign Up</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-1/5'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p className='text-sm font-medium text-destructive'>
              {form.formState.errors.root.message}
            </p>
          )}
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SignUp;
