import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import Loading from './components/Loading';

const Account = lazy(() => import('./pages/Account'));
const Activities = lazy(() => import('./pages/Activities'));
const ActivityDetails = lazy(() => import('./pages/ActivityDetails'));
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ParkDetails = lazy(() => import('./pages/ParkDetails'));
const Parks = lazy(() => import('./pages/Parks'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Users = lazy(() => import('./pages/Users'));

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
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <MainNav />
      <div className='flex-grow py-4 px-8'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
