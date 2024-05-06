import { deletePark } from '@/api/parks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface ParkCardProps {
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
}

function ParkCard({ id, name, location, description, website }: ParkCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const { invalidateQueries } = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deletePark,
    onSuccess: () => {
      invalidateQueries({ queryKey: ['parks'], exact: true });
    },
  });

  const onDelete = () => {
    mutate(id);
  };

  return (
    <Card className='w-80 relative'>
      <CardHeader className='flex flex-row justify-between'>
        <div className='flex flex-col'>
          <CardTitle className='text-xl'>{name}</CardTitle>
          <CardDescription>{location}</CardDescription>
        </div>
        <X
          // fill={isLiked ? 'red' : 'none'}
          // stroke={isLiked ? 'red' : '#606C38'}
          className='h-4 w-4 cursor-pointer hover:text-accent'
          onClick={onDelete}
        />
      </CardHeader>
      <CardContent className='h-32 mb-16 overflow-auto'>
        <p>{description}</p>
      </CardContent>
      <CardFooter className='flex justify-between absolute bottom-0 w-full p-3'>
        <Button variant='ghost'>
          <a
            target='_blank'
            href={website}
            className='text-accent hover:text-background'
          >
            More Info
          </a>
        </Button>
        <Heart
          fill={isLiked ? 'red' : 'none'}
          className='h-4 w-4 cursor-pointer hover:text-red-500 m-3'
          onClick={() => {
            setIsLiked(!isLiked);
          }}
        />
      </CardFooter>
    </Card>
  );
}

export default ParkCard;
