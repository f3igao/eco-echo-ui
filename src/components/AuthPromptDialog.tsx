import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}

export function AuthPromptDialog({
  open,
  onOpenChange,
  message = 'Sign in to save parks to your wishlist and log visits.',
}: AuthPromptDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2 pt-1'>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/login');
            }}
            className='w-full gap-2'
          >
            <LogIn className='w-4 h-4' />
            Sign In
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              navigate('/signup');
            }}
            className='w-full gap-2'
          >
            <UserPlus className='w-4 h-4' />
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
