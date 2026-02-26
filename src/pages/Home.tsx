import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-y-3 h-full'>
      <h1 className='text-5xl font-bold text-text'>Eco Echo</h1>
      <p className='text-accent'>
        Your Ultimate Hub for Park Exploration and Community Engagement
      </p>
      <div className='flex items-center gap-x-3 mt-6'>
        <Button asChild className='border-primary'>
          <Link to='/signup'>Sign Up</Link>
        </Button>
        <Button
          asChild
          className='hover:border-accent text-primary hover:text-primary'
          variant='outline'
        >
          <Link to='/login'>Log In</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
