import { updateUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validateEmail, validateMinLength } from '@/lib/form-validations';
import type { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { CalendarDays, KeyRound, LogOut, Mail, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// TODO: replace with actual user from auth context
const MOCK_USER: User = {
  user_id: 1,
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  password: '',
  created_at: new Date('2024-03-15'),
  updated_at: new Date(),
};

const profileSchema = z.object({
  name: validateMinLength(2, 'Name must be at least 2 characters.'),
  email: validateEmail(),
});

const passwordSchema = z
  .object({
    currentPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
    newPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
    confirmPassword: validateMinLength(6, 'Password must be at least 6 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}


function ProfileSection({ user }: { user: User }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) =>
      updateUser(user.user_id, { ...user, ...data }),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (error: unknown) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update profile. Please try again.';
      form.setError('root', { message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-semibold shrink-0'>
            {getInitials(user.name)}
          </div>
          <div>
            <CardTitle className='text-text'>{user.name}</CardTitle>
            <CardDescription className='flex items-center gap-1.5 mt-1'>
              <CalendarDays className='w-3.5 h-3.5' />
              Member since{' '}
              {user.created_at.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1.5'>
                    <UserRound className='w-3.5 h-3.5' /> Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className='flex items-center gap-1.5'>
                    <Mail className='w-3.5 h-3.5' /> Email
                  </FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
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
            <div className='flex items-center gap-3 pt-1'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
              {saved && (
                <span className='text-sm text-primary font-medium'>
                  Changes saved!
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [saved, setSaved] = useState(false);

  // TODO: wire up to a real change-password endpoint
  const mutation = useMutation({
    mutationFn: async (_data: z.infer<typeof passwordSchema>) => {
      await new Promise((res) => setTimeout(res, 600));
    },
    onSuccess: () => {
      form.reset();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => {
      form.setError('root', {
        message: 'Failed to change password. Please try again.',
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-text'>
          <KeyRound className='w-5 h-5' /> Change Password
        </CardTitle>
        <CardDescription>
          Choose a strong password of at least 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
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
            <div className='flex items-center gap-3 pt-1'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update password'}
              </Button>
              {saved && (
                <span className='text-sm text-primary font-medium'>
                  Password updated!
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DangerZone() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // TODO: call deleteUser(user_id) and clear auth state
      await new Promise((res) => setTimeout(res, 600));
    },
    onSuccess: () => {
      setOpen(false);
      navigate('/');
    },
  });

  const logOut = () => {
    // TODO: clear auth tokens / session
    navigate('/login');
  };

  return (
    <Card className='border-destructive/40'>
      <CardHeader>
        <CardTitle className='text-destructive'>Danger zone</CardTitle>
        <CardDescription>
          These actions are permanent and cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col sm:flex-row gap-3'>
        <Button variant='outline' className='gap-2' onClick={logOut}>
          <LogOut className='w-4 h-4' /> Log out
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='destructive' className='gap-2'>
              <Trash2 className='w-4 h-4' /> Delete account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function Account() {
  return (
    <div className='max-w-2xl mx-auto py-8 flex flex-col gap-6'>
      <h2 className='text-2xl font-bold text-text'>Account</h2>
      <ProfileSection user={MOCK_USER} />
      <PasswordSection />
      <DangerZone />
    </div>
  );
}

export default Account;
