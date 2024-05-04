import { Button } from '@/components/ui/button';

function Home() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-y-3'>
      <h1 className='text-3xl font-bold text-text'>Eco Echo</h1>
      <p className='text-accent'>
        Your Ultimate Hub for Park Exploration and Community Engagement
      </p>
      <div className='flex items-center gap-x-3 mt-6'>
        <Button>Sign Up</Button>
        <Button variant='outline'>Log In</Button>
      </div>
    </div>
  );
}

export default Home;
