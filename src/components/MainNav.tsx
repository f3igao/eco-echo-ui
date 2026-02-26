import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

export function MainNav() {
  return (
    <div className='flex justify-between items-center p-2'>
      <Link to='/' className='flex gap-x-3 cursor-pointer mx-3 items-center'>
        <img src='/logo.svg' className='w-12' alt='logo' />
        <p className='text-text font-semibold text-2xl'>Eco Echo</p>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to='/parks' className={navigationMenuTriggerStyle()}>
                Parks
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to='/activities' className={navigationMenuTriggerStyle()}>
                Activities
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to='/users' className={navigationMenuTriggerStyle()}>
                Users
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to='/wishlists' className={navigationMenuTriggerStyle()}>
                Wishlists
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to='/account' className={navigationMenuTriggerStyle()}>
                Account
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
