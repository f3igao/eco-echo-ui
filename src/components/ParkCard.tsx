import { getParkBgImgUrl } from '@/lib/utils';
import classNames from 'classnames';
import { Bookmark, CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface ParkCardProps {
  index: number;
  id: number;
  name: string;
  location: string;
  description: string;
  website: string;
}

function ParkCard({
  index,
  id,
  name,
  location,
  description,
  website,
}: ParkCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [haveBeen, setHaveBeen] = useState(false);

  // TODO: bookmark and have been only shows up for logged in users
  const isLoggedIn = true;
  const isWishlist = true;

  return (
    <Card
      className={classNames(
        'w-80 h-72 relative bg-cover cursor-pointer',
        getParkBgImgUrl(name),
        // `bg-[url('src/assets/park-cover-photos/biscayne.jpeg')]`,
        { 'grayscale-[75%] hover:grayscale-0': isWishlist && !haveBeen }
      )}
    >
      <CardHeader className='flex flex-row justify-between w-full p-0'>
        <span className='text-white font-bold mx-2 border-b-2'>{index}</span>
        {isLoggedIn && (
          <Bookmark
            fill={isBookmarked ? 'white' : 'none'}
            className='h-4 w-4 cursor-pointer text-white hover:fill-white m-3'
            onClick={() => {
              setIsBookmarked(!isBookmarked);
            }}
          />
        )}
      </CardHeader>
      <CardContent className='flex flex-col justify-center items-center h-4/5 text-center w-full'>
        <CardTitle className='text-3xl text-white font-bold'>{name}</CardTitle>
        <CardDescription className='text-white text-lg font-semibold'>
          {location}
        </CardDescription>
      </CardContent>
      <CardFooter className='flex justify-end w-full p-0 absolute bottom-0'>
        {isLoggedIn && (
          <CircleCheckBig
            fill={haveBeen ? 'green' : 'none'}
            className={classNames(
              'h-4 w-4 cursor-pointer hover:fill-primary m-3 hover:text-[green-400]',
              haveBeen ? 'text-green-400' : 'text-white'
            )}
            onClick={() => {
              setHaveBeen(!haveBeen);
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
}

export default ParkCard;
