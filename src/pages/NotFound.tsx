import Link from 'next/link';

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center gap-y-3'>
      <h2 className='text-3xl font-bold text-text'>Nothing to see here</h2>
      <p className='text-accent'>
        <Link href='/' legacyBehavior passHref>
          Back to home page
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
