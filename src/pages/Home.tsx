import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-y-3 h-full'>
      <h1 className='text-5xl font-bold text-text'>Eco Echo</h1>
      <p className='text-accent'>
        Your Ultimate Hub for Park Exploration and Community Engagement
      </p>
      <div className='flex items-center gap-x-3 mt-6'>
        <Button>
          <Link href='signup'>Sign Up</Link>
        </Button>
        <Button variant='outline'>Log In</Button>
      </div>
    </div>
  );
}

export default Home;
