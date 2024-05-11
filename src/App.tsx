import { Outlet, Route, Routes } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import Account from './pages/Account';
import Activities from './pages/Activities';
import ActivityDetails from './pages/ActivityDetails';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ParkDetails from './pages/ParkDetails';
import Parks from './pages/Parks';
import SignUp from './pages/SignUp';
import Users from './pages/Users';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='account' element={<Account />} />
        <Route path='/parks' element={<Parks />} />
        <Route path='/parks/:park_id' element={<ParkDetails />} />
        {/* <Route path='/wishlists' element={<Wishlists />} /> */}
        {/* <Route path='/wishlists/:wishlist_id' element={<WishlistDetails/>} /> */}
        <Route path='/activities' element={<Activities />} />
        <Route path='/activities/:activity_id' element={<ActivityDetails />} />
        <Route path='/users' element={<Users />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <MainNav />
      <div className='flex-grow flex items-center justify-center p-2'>
        <Outlet />
      </div>
    </div>
  );
}
