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
    <div className='flex justify-between items-center p-2'>
      <Link href='/' className='flex gap-x-3 cursor-pointer mx-3 items-center'>
        <img src='public/logo.svg' className='w-12' alt='logo' />
        <p className='text-text font-semibold text-2xl'>Eco Echo</p>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href='wishlists'
              className={navigationMenuTriggerStyle()}
            >
              Wishlists
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          <NavigationMenuItem>
            <NavigationMenuLink
              href='parks'
              className={navigationMenuTriggerStyle()}
            >
              Parks
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href='activities'
              className={navigationMenuTriggerStyle()}
            >
              Activities
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href='users'
              className={navigationMenuTriggerStyle()}
            >
              Users
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href='account'
              className={navigationMenuTriggerStyle()}
            >
              Account
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
