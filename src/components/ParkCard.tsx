import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Park } from '@/types/park';
import { clsx } from 'clsx';
import { Bookmark, CircleCheckBig } from 'lucide-react';
import { useEffect, useState } from 'react';
import ParkDetails from '@/pages/ParkDetails';
import ParkCardSkeleton from './ParkCardSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

const kebabCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');

interface ParkCardProps {
  index: number;
  park: Park;
  wishlisted?: boolean;
  onToggleWishlist?: () => void;
  isToggling?: boolean;
  haveBeen?: boolean;
}

function ParkCard({
  index,
  park,
  wishlisted = false,
  onToggleWishlist,
  isToggling = false,
  haveBeen = false,
}: ParkCardProps) {
  const { name, location } = park;
  const [imageLoaded, setImageLoaded] = useState(false);

  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '100px',
  });

  useEffect(() => {
    if (!isVisible) return;
    const img = new Image();
    img.src = `/park-cover-photos/${kebabCase(name)}.jpg`;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, [isVisible, name]);

  // TODO: replace with actual auth state
  const isLoggedIn = true;

  const backgroundImage = `url('/park-cover-photos/${kebabCase(name)}.jpg')`;

  return (
    <div ref={ref}>
      {!imageLoaded ? (
        <ParkCardSkeleton />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Card
              className={clsx(
                'w-80 h-72 relative bg-cover cursor-pointer transition-opacity duration-500 opacity-100',
                { 'grayscale-[75%] hover:grayscale-0': !haveBeen }
              )}
              style={{ backgroundImage }}
            >
              <CardHeader className='flex flex-row justify-between w-full p-0'>
                <span className='text-white font-bold mx-2 border-b-2'>{index}</span>
                {isLoggedIn && onToggleWishlist && (
                  <Bookmark
                    fill={wishlisted ? 'white' : 'none'}
                    className={clsx(
                      'h-4 w-4 cursor-pointer text-white hover:fill-white m-3 transition-all',
                      isToggling && 'opacity-50 pointer-events-none'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist();
                    }}
                  />
                )}
              </CardHeader>
              <CardContent className='flex flex-col justify-center items-center h-5/6 text-center w-full'>
                <CardTitle className='text-3xl text-white font-bold'>{name}</CardTitle>
                <CardDescription className='text-white text-lg font-semibold'>
                  {location}
                </CardDescription>
              </CardContent>
              <CardFooter className='flex justify-end w-full p-0 absolute bottom-0'>
                {isLoggedIn && (
                  <CircleCheckBig
                    fill={haveBeen ? 'green' : 'none'}
                    className={clsx(
                      'h-4 w-4 m-3',
                      haveBeen ? 'text-green-400' : 'text-white'
                    )}
                  />
                )}
              </CardFooter>
            </Card>
          </DialogTrigger>
          <DialogContent className='max-w-[640px]'>
            <ParkDetails park={park} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ParkCard;
