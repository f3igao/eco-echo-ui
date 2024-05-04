import { Outlet, Route, Routes } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import Account from './pages/Account';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='account' element={<Account />} />
        {/* <Route path='/parks' element={<ParksPage/>} />
        <Route path='/parks/:park_id' element={<ParkDetailsPage/>} />
        <Route path='/wishlists' element={<WishlistsPage/>} />
        <Route path='/wishlists/:wishlist_id' element={<WishlistDetailsPage/>} />
        <Route path='/activities' element={<ActivitiesPage/>} />
        <Route path='/activities/:activity_id' element={<ActivityDetailsPage/>} /> */}
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <MainNav />
      <Outlet />
    </div>
  );
}
