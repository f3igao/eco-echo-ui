import { TreePine } from 'lucide-react';

function ParkCardSkeleton() {
  return (
    <div className='w-80 h-72 rounded-lg bg-muted flex flex-col items-center justify-center gap-3 animate-pulse'>
      <TreePine className='w-16 h-16 text-muted-foreground/30' strokeWidth={1.5} />
    </div>
  );
}

export default ParkCardSkeleton;
