import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import type { Wishlist } from '@/types/wishlist';
import { BookmarkX, CalendarRange, ChevronDown, ChevronUp, MapPin, MessageSquare } from 'lucide-react';
import ParkDetails from '@/pages/ParkDetails';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

function formatDateDisplay(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year}`;
}

function WishlistCard({
  wishlist,
  park,
  onRemove,
}: {
  wishlist: Wishlist;
  park: Park | undefined;
  onRemove: (parkId: number, parkName: string) => void;
}) {
  const { isToggling, updateWishlist, isUpdating } = useWishlists(MOCK_USER_ID);
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(wishlist.planned_date_start ?? '');
  const [endDate, setEndDate] = useState(wishlist.planned_date_end ?? '');
  const [notes, setNotes] = useState(wishlist.notes ?? '');
  const [isDirty, setIsDirty] = useState(false);

  // Sync local form state when the server data updates after a save
  useEffect(() => {
    setStartDate(wishlist.planned_date_start ?? '');
    setEndDate(wishlist.planned_date_end ?? '');
    setNotes(wishlist.notes ?? '');
    setIsDirty(false);
  }, [wishlist.planned_date_start, wishlist.planned_date_end, wishlist.notes]);

  if (!park) {
    return (
      <div className='flex items-center gap-3 rounded-lg border bg-card p-4 text-muted-foreground text-sm'>
        Loading park...
      </div>
    );
  }

  const hasPlannedDates = wishlist.planned_date_start || wishlist.planned_date_end;
  const hasNotes = wishlist.notes;

  function handleSave() {
    updateWishlist({
      wishlistId: wishlist.wishlist_id,
      data: {
        planned_date_start: startDate || null,
        planned_date_end: endDate || null,
        notes: notes || null,
      },
    });
    setIsDirty(false);
    setIsExpanded(false);
  }

  function handleCancel() {
    setStartDate(wishlist.planned_date_start ?? '');
    setEndDate(wishlist.planned_date_end ?? '');
    setNotes(wishlist.notes ?? '');
    setIsDirty(false);
    setIsExpanded(false);
  }

  return (
    <Dialog>
      <div className='rounded-lg border bg-card transition-shadow hover:shadow-sm'>
        {/* Main row */}
        <div className='flex items-center gap-4 p-4'>
          <div className='flex-1 min-w-0'>
            <DialogTrigger asChild>
              <button type='button' className='text-left w-full'>
                <p className='font-semibold text-text hover:text-primary transition-colors truncate'>
                  {park.name}
                </p>
                <p className='text-sm text-muted-foreground flex items-center gap-1 mt-0.5'>
                  <MapPin className='w-3 h-3 shrink-0' />
                  {park.location}
                </p>
              </button>
            </DialogTrigger>
            {/* Summary badges when collapsed */}
            {!isExpanded && (hasPlannedDates || hasNotes) && (
              <div className='flex flex-wrap items-center gap-2 mt-2'>
                {hasPlannedDates && (
                  <span className='inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5'>
                    <CalendarRange className='w-3 h-3' />
                    {formatDateDisplay(wishlist.planned_date_start)}
                    {wishlist.planned_date_end && wishlist.planned_date_end !== wishlist.planned_date_start
                      ? ` – ${formatDateDisplay(wishlist.planned_date_end)}`
                      : ''}
                  </span>
                )}
                {hasNotes && (
                  <span className='inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5'>
                    <MessageSquare className='w-3 h-3' />
                    Note added
                  </span>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <button
              type='button'
              onClick={() => setIsExpanded((v) => !v)}
              className='text-muted-foreground hover:text-primary transition-colors p-1 rounded'
              title={isExpanded ? 'Collapse' : 'Add dates & notes'}
            >
              {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
            </button>
            <button
              type='button'
              onClick={() => onRemove(wishlist.park_id, park.name)}
              disabled={isToggling}
              className='text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 p-1 rounded'
              title='Remove from wishlist'
            >
              <BookmarkX className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Expandable edit panel */}
        {isExpanded && (
          <div className='border-t px-4 pb-4 pt-3 space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label htmlFor={`start-${wishlist.wishlist_id}`} className='text-xs text-muted-foreground'>
                  From
                </Label>
                <Input
                  id={`start-${wishlist.wishlist_id}`}
                  type='date'
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setIsDirty(true);
                  }}
                  className='text-sm h-8'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor={`end-${wishlist.wishlist_id}`} className='text-xs text-muted-foreground'>
                  To
                </Label>
                <Input
                  id={`end-${wishlist.wishlist_id}`}
                  type='date'
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setIsDirty(true);
                  }}
                  className='text-sm h-8'
                />
              </div>
            </div>

            <div className='space-y-1'>
              <Label htmlFor={`notes-${wishlist.wishlist_id}`} className='text-xs text-muted-foreground'>
                Notes
              </Label>
              <Textarea
                id={`notes-${wishlist.wishlist_id}`}
                placeholder='Things to pack, trails to try, reminders…'
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setIsDirty(true);
                }}
                className='text-sm min-h-[72px] resize-none'
              />
            </div>

            <div className='flex justify-end gap-2 pt-1'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type='button'
                size='sm'
                onClick={handleSave}
                disabled={isUpdating || !isDirty}
              >
                {isUpdating ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <DialogContent className='max-w-[640px]'>
        <ParkDetails park={park} />
      </DialogContent>
    </Dialog>
  );
}

export default WishlistCard;
