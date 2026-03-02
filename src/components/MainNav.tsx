import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const authedNavLinks = [
  { to: '/parks', label: 'Parks' },
  { to: '/forum', label: 'Forum' },
  { to: '/users', label: 'Users' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/passport', label: 'Passport' },
  { to: '/account', label: 'Account' },
];

const guestNavLinks = [
  { to: '/parks', label: 'Parks' },
  { to: '/forum', label: 'Forum' },
  { to: '/login', label: 'Log In' },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navLinks = user ? authedNavLinks : guestNavLinks;

  return (
    <div className='relative'>
      <div className='flex justify-between items-center p-2'>
        <Link to='/' className='flex gap-x-3 cursor-pointer mx-3 items-center'>
          <img src='/logo.svg' className='w-12' alt='logo' />
          <p className='text-text font-semibold text-2xl'>Eco Echo</p>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            {navLinks.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink asChild>
                  {to === '/account' && user ? (
                    <Link to={to} className='px-3 py-2'>
                      <div className='w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold'>
                        {getInitials(user.name)}
                      </div>
                    </Link>
                  ) : (
                    <Link to={to} className={navigationMenuTriggerStyle()}>
                      {label}
                    </Link>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Hamburger button */}
        <button
          type='button'
          className='md:hidden p-2 mr-2 rounded-md hover:bg-accent transition-colors'
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label='Toggle menu'
        >
          {mobileOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className='md:hidden absolute top-full left-0 right-0 z-50 bg-background border-b border-border shadow-md flex flex-col'>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground${pathname === to ? ' text-primary font-semibold' : ' text-foreground'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
