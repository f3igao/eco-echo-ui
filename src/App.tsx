import { Outlet, Route, Routes } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import Account from './pages/Account';
import Activities from './pages/Activities';
import ActivityDetails from './pages/ActivityDetails';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ParkDetails from './pages/ParkDetails';
import Parks from './pages/Parks';
import Wishlists from './pages/Wishlists';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='account' element={<Account />} />
        <Route path='/parks' element={<Parks />} />
        <Route path='/parks/:park_id' element={<ParkDetails />} />
        <Route path='/wishlists' element={<Wishlists />} />
        {/* <Route path='/wishlists/:wishlist_id' element={<WishlistDetails/>} /> */}
        <Route path='/activities' element={<Activities />} />
        <Route path='/activities/:activity_id' element={<ActivityDetails />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <>
      <MainNav />
      <div className='my-6 mx-12'>
        <Outlet />
      </div>
    </>
  );
}
