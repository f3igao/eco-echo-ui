import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Park } from '@/types/park';
import classNames from 'classnames';
import { kebabCase } from 'lodash';
import {
  ArrowUpRight,
  Bookmark,
  CircleCheckBig,
  SquareArrowOutUpRight,
} from 'lucide-react';
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
  park: Park;
}

function ParkCard({ index, park }: ParkCardProps) {
  const {
    park_id,
    name,
    location,
    description,
    established_date: establsihedDate,
    size,
    visitor_count: visitorCount,
    website,
    entrance_info: entranceInfo,
  } = park;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [haveBeen, setHaveBeen] = useState(false);

  // TODO: bookmark and have been only shows up for logged in users
  const isLoggedIn = true;
  const isWishlist = true;

  const backgroundImage = `url('/park-cover-photos/${kebabCase(name)}.jpg')`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={classNames('w-80 h-72 relative bg-cover cursor-pointer', {
            'grayscale-[75%] hover:grayscale-0': isWishlist && !haveBeen,
          })}
          style={{ backgroundImage }}
        >
          <CardHeader className='flex flex-row justify-between w-full p-0'>
            <span className='text-white font-bold mx-2 border-b-2'>
              {index}
            </span>
            {isLoggedIn && (
              <Bookmark
                fill={isBookmarked ? 'white' : 'none'}
                className='h-4 w-4 cursor-pointer text-white hover:fill-white m-3'
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookmarked(!isBookmarked);
                }}
              />
            )}
          </CardHeader>
          <CardContent className='flex flex-col justify-center items-center h-5/6 text-center w-full'>
            <CardTitle className='text-3xl text-white font-bold'>
              {name}
            </CardTitle>
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
                onClick={(e) => {
                  e.preventDefault();
                  setHaveBeen(!haveBeen);
                }}
              />
            )}
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className='max-w-[640px]'>
        <DialogHeader>
          <DialogTitle>
            <a className='hover:text-primary' href={`/parks/${park_id}`}>
              {name}
            </a>
          </DialogTitle>
          <DialogDescription>{location}</DialogDescription>
        </DialogHeader>
        <div>{description}</div>
        <div>Est. {establsihedDate}</div>
        <div>Size: {size}</div>
        <div>Visitor Counter: {visitorCount}</div>
        <div>Entrance Info: {entranceInfo}</div>
        <div className='flex items-center gap-x-1'>
          <span>Learn more at</span>
          <a
            href={website}
            className='group underline hover:text-accent inline-flex'
          >
            <span>{website}</span>
            <ArrowUpRight className='h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 translate-y-1 ml-0.5' />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ParkCard;
