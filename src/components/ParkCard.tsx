import { Heart } from 'lucide-react';
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
  name: string;
  location: string;
  description: string;
  website: string;
}

function ParkCard({ name, location, description, website }: ParkCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className='w-80 relative'>
      <CardHeader>
        <CardTitle className='text-xl'>{name}</CardTitle>
        <CardDescription>{location}</CardDescription>
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
          stroke={isLiked ? 'red' : '#606C38'}
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
