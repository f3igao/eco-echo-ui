import { getParkReviewsByUser } from '@/api/park-reviews';
import { deleteUser, updateUser } from '@/api/users';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validateMinLength } from '@/lib/form-validations';
import type { ParkReview } from '@/types/parkReview';
import type { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CalendarDays,
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  Shield,
  Trash2,
  TreePine,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';


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

function getExplorerTier(uniqueParks: number): string {
  if (uniqueParks === 0) return 'New explorer';
  if (uniqueParks < 5) return 'Active explorer';
  if (uniqueParks < 10) return 'Trailblazer';
  return 'Park legend';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type Section = 'profile' | 'password' | 'danger' | null;

function ProfileCard({ user, onEdit }: { user: User; onEdit: () => void }) {
  return (
    <Card className='overflow-hidden'>
      <div className='h-20 bg-gradient-to-br from-primary/80 to-primary' />
      <CardContent className='pt-0 pb-6'>
        <div className='-mt-10 flex flex-col items-center text-center gap-3'>
          <div className='w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-md'>
            {getInitials(user.name)}
          </div>
          <div>
            <h3 className='text-xl font-bold text-foreground'>{user.name}</h3>
            <p className='text-sm text-muted-foreground mt-0.5'>{user.email}</p>
          </div>
          <Badge className='gap-1.5 text-xs'>
            <CalendarDays className='w-3 h-3' />
            Member since{' '}
            {new Date(user.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Badge>
          <Button size='sm' variant='outline' className='mt-1 w-full' onClick={onEdit}>
            Edit profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SettingsTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active?: boolean;
}

function SettingsTile({ icon, title, description, onClick, active }: SettingsTileProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`group w-full text-left p-5 rounded-xl border transition-all duration-150 hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? 'border-primary/60 bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:bg-accent/30'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3.5'>
          <div
            className={`mt-0.5 p-2 rounded-lg transition-colors ${
              active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
            }`}
          >
            {icon}
          </div>
          <div>
            <p className='font-semibold text-foreground text-sm'>{title}</p>
            <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>{description}</p>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 mt-1 shrink-0 transition-transform ${
            active ? 'text-primary rotate-90' : 'text-muted-foreground group-hover:translate-x-0.5'
          }`}
        />
      </div>
    </button>
  );
}

function PersonalInfoForm({ user, onClose }: { user: User; onClose: () => void }) {
  const { setUser } = useAuth();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) =>
      updateUser(user.user_id, { ...user, ...data }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
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
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <UserRound className='w-5 h-5 text-primary' />
          <CardTitle className='text-base'>Personal information</CardTitle>
        </div>
        <CardDescription>Update your display name and email address.</CardDescription>
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
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your name' {...field} />
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
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='your@email.com' {...field} />
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
            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center gap-3'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving…' : 'Save changes'}
                </Button>
                <Button type='button' variant='ghost' onClick={onClose}>
                  Cancel
                </Button>
              </div>
              {saved && (
                <span className='text-sm text-primary font-medium animate-in fade-in'>
                  Saved!
                </span>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PasswordForm({ onClose }: { onClose: () => void }) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
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
      form.setError('root', { message: 'Failed to change password. Please try again.' });
    },
  });

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <Shield className='w-5 h-5 text-primary' />
          <CardTitle className='text-base'>Password &amp; security</CardTitle>
        </div>
        <CardDescription>Choose a strong password of at least 6 characters.</CardDescription>
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
            <Separator />
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
            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center gap-3'>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? 'Updating…' : 'Update password'}
                </Button>
                <Button type='button' variant='ghost' onClick={onClose}>
                  Cancel
                </Button>
              </div>
              {saved && (
                <span className='text-sm text-primary font-medium animate-in fade-in'>
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

function DangerPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user?.user_id ?? 0),
    onSuccess: () => {
      logout();
      setOpen(false);
      navigate('/');
    },
  });

  const logOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <Card className='border-destructive/30'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <LogOut className='w-5 h-5 text-destructive' />
          <CardTitle className='text-base text-destructive'>Account actions</CardTitle>
        </div>
        <CardDescription>
          Log out of your session or permanently remove your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between rounded-lg border p-4'>
          <div>
            <p className='text-sm font-medium'>Log out</p>
            <p className='text-xs text-muted-foreground mt-0.5'>Sign out of this device</p>
          </div>
          <Button variant='outline' size='sm' className='gap-1.5' onClick={logOut}>
            <LogOut className='w-3.5 h-3.5' /> Log out
          </Button>
        </div>

        <div className='flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
          <div>
            <p className='text-sm font-medium text-destructive'>Delete account</p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Permanently remove all your data
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant='destructive' size='sm' className='gap-1.5'>
                <Trash2 className='w-3.5 h-3.5' /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account and all associated data. This action
                  cannot be undone.
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
                  {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Button type='button' variant='ghost' size='sm' onClick={onClose} className='mt-1'>
          Close
        </Button>
      </CardContent>
    </Card>
  );
}

function Account() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>(null);

  const toggleSection = (section: Section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const { data: reviewsData } = useQuery({
    queryKey: ['park-reviews', 'user', user?.user_id],
    queryFn: () =>
      getParkReviewsByUser(user?.user_id as number).catch((err) => {
        if (err?.response?.status === 404) return { park_reviews: [] as ParkReview[] };
        throw err;
      }),
    enabled: !!user?.user_id,
    staleTime: 5 * 60 * 1000,
  });

  const uniqueParks = new Set((reviewsData?.park_reviews ?? []).map((r: ParkReview) => r.park_id)).size;
  const explorerTier = getExplorerTier(uniqueParks);

  if (!user) return null;

  return (
    <div className='max-w-4xl mx-auto py-10 px-4 sm:px-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Account</h1>
        <p className='text-muted-foreground mt-1'>Manage your profile and preferences.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start'>
        {/* Left — profile summary */}
        <div className='space-y-4'>
          <ProfileCard
            user={user}
            onEdit={() => toggleSection('profile')}
          />

          <Card className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10 text-primary'>
                <TreePine className='w-4 h-4' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Eco passport</p>
                <p className='text-sm font-semibold text-foreground'>{explorerTier}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right — settings tiles + expanded panels */}
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <SettingsTile
              icon={<UserRound className='w-4 h-4' />}
              title='Personal information'
              description='Name, email address'
              onClick={() => toggleSection('profile')}
              active={activeSection === 'profile'}
            />
            <SettingsTile
              icon={<KeyRound className='w-4 h-4' />}
              title='Password &amp; security'
              description='Update your password'
              onClick={() => toggleSection('password')}
              active={activeSection === 'password'}
            />
            <SettingsTile
              icon={<Mail className='w-4 h-4' />}
              title='Notifications'
              description='Park updates &amp; alerts'
              onClick={() => {}}
              active={false}
            />
            <SettingsTile
              icon={<Shield className='w-4 h-4' />}
              title='Account actions'
              description='Log out or delete account'
              onClick={() => toggleSection('danger')}
              active={activeSection === 'danger'}
            />
          </div>

          {activeSection === 'profile' && (
            <PersonalInfoForm user={user} onClose={() => setActiveSection(null)} />
          )}
          {activeSection === 'password' && (
            <PasswordForm onClose={() => setActiveSection(null)} />
          )}
          {activeSection === 'danger' && (
            <DangerPanel onClose={() => setActiveSection(null)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
