import Link from 'next/link';

function NotFound() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-y-3'>
      <h2 className='text-3xl font-bold text-text'>Nothing to see here</h2>
      <p>
        <Link href='/' className='text-accent' legacyBehavior passHref>
          Back to home page
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
