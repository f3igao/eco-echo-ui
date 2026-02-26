import { login } from '@/api/users';
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
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: validateEmail(),
  password: validateMinLength(6, 'Password must be at least 6 characters.'),
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Invalid email or password.';
      form.setError('root', { message });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className='flex flex-col justify-center h-screen items-center gap-y-8'>
      <h2 className='text-3xl font-bold text-text'>Log In</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-1/5'
        >
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
          <div className='flex flex-col gap-y-3'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Logging in...' : 'Log In'}
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-primary underline underline-offset-4 hover:text-primary/80'>
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Login;
