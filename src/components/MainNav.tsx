import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export function MainNav() {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-x-3 cursor-pointer mx-3 items-center'>
        <img src='public/logo.svg' className='w-12' alt='logo' />
        <p className='text-text font-semibold text-2xl'>
          <Link href='/'>
            Eco Echo
          </Link>
        </p>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href='wishlists'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Wishlists
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='parks'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Parks
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='activities'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Activities
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='users'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Users
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='account'>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Account
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
