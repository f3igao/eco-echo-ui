import { clsx } from 'clsx';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const iconClass = clsx(
    'transition-colors',
    size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
    readonly ? 'cursor-default' : 'cursor-pointer'
  );

  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (readonly ? value : (hovered || value));
        return (
          <Star
            key={star}
            className={clsx(iconClass, filled ? 'text-amber-400' : 'text-muted-foreground/40')}
            fill={filled ? 'currentColor' : 'none'}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(star)}
          />
        );
      })}
    </div>
  );
}
