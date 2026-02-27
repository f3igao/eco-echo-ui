import { useWishlists } from '@/hooks/useWishlists';
import type { Park } from '@/types/park';
import type { Wishlist } from '@/types/wishlist';
import { BookmarkX, CalendarRange, ChevronDown, ChevronUp, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

// TODO: replace with actual user from auth context
const MOCK_USER_ID = 1;

function parseDateStr(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toDateStr(date: Date | undefined): string | null {
  if (!date) return null;
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: parseDateStr(wishlist.planned_date_start),
    to: parseDateStr(wishlist.planned_date_end),
  });
  const [notes, setNotes] = useState(wishlist.notes ?? '');
  const [isDirty, setIsDirty] = useState(false);

  // Sync local form state when the server data updates after a save
  useEffect(() => {
    setDateRange({
      from: parseDateStr(wishlist.planned_date_start),
      to: parseDateStr(wishlist.planned_date_end),
    });
    setNotes(wishlist.notes ?? '');
    setIsDirty(false);
  }, [wishlist.planned_date_start, wishlist.planned_date_end, wishlist.notes]);

  if (!park) {
    return (
      <Card className='flex items-center gap-3 p-4 text-muted-foreground text-sm'>
        Loading park...
      </Card>
    );
  }

  const hasPlannedDates = wishlist.planned_date_start || wishlist.planned_date_end;
  const hasNotes = wishlist.notes;

  function handleSave() {
    updateWishlist({
      wishlistId: wishlist.wishlist_id,
      data: {
        planned_date_start: toDateStr(dateRange?.from),
        planned_date_end: toDateStr(dateRange?.to),
        notes: notes || null,
      },
    });
    setIsDirty(false);
    setIsExpanded(false);
  }

  function handleCancel() {
    setDateRange({
      from: parseDateStr(wishlist.planned_date_start),
      to: parseDateStr(wishlist.planned_date_end),
    });
    setNotes(wishlist.notes ?? '');
    setIsDirty(false);
    setIsExpanded(false);
  }

  return (
    <Card className='transition-all hover:ring-2 hover:ring-primary/50 hover:shadow-[0_0_16px_hsl(var(--primary)/0.2)]'>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Main row */}
        <div className='flex items-center gap-2 pr-2'>
          <CollapsibleTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              className='flex-1 min-w-0 flex items-center gap-4 p-4 h-auto justify-start text-left hover:bg-transparent'
            >
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-text hover:text-primary transition-colors truncate'>
                  {park.name}
                </p>
                <p className='text-sm text-muted-foreground flex items-center gap-1 mt-0.5'>
                  <MapPin className='w-3 h-3 shrink-0' />
                  {park.location}
                </p>
                {/* Summary badges when collapsed */}
                {!isExpanded && (hasPlannedDates || hasNotes) && (
                  <div className='flex flex-wrap items-center gap-2 mt-2'>
                    {hasPlannedDates && (
                      <Badge className='gap-1 font-normal'>
                        <CalendarRange className='w-3 h-3' />
                        {formatDateDisplay(wishlist.planned_date_start)}
                        {wishlist.planned_date_end && wishlist.planned_date_end !== wishlist.planned_date_start
                          ? ` – ${formatDateDisplay(wishlist.planned_date_end)}`
                          : ''}
                      </Badge>
                    )}
                    {hasNotes && (
                      <Badge className='gap-1 font-normal'>
                        <MessageSquare className='w-3 h-3' />
                        Note added
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className='text-muted-foreground shrink-0'>
                {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
              </div>
            </Button>
          </CollapsibleTrigger>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => onRemove(wishlist.park_id, park.name)}
                  disabled={isToggling}
                  className='text-muted-foreground hover:text-destructive hover:bg-transparent shrink-0'
                >
                  <BookmarkX className='w-5 h-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove from wishlist</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Expandable edit panel */}
        <CollapsibleContent>
          <Separator />
          <div className='px-4 pb-4 pt-3 space-y-3'>
            <div className='flex gap-6 items-stretch'>
              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-muted-foreground'>Dates</Label>
                <Calendar
                  mode='range'
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setIsDirty(true);
                  }}
                  disabled={{ before: new Date() }}
                  numberOfMonths={1}
                />
                <p className='text-xs text-muted-foreground text-center h-4'>
                  {dateRange?.from
                    ? `${formatDateDisplay(toDateStr(dateRange.from))} – ${dateRange.to ? formatDateDisplay(toDateStr(dateRange.to)) : '…'}`
                    : ''}
                </p>
              </div>

              <div className='flex flex-col gap-1 flex-1'>
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
                  className='text-sm resize-none flex-1 mb-5 border-none p-4'
                />
              </div>
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default WishlistCard;
