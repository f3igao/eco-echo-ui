import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import Loading from './components/Loading';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';

const Account = lazy(() => import('./pages/Account'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Parks = lazy(() => import('./pages/Parks'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Users = lazy(() => import('./pages/Users'));
const Passport = lazy(() => import('./pages/Passport'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Parks />} />
        <Route path='account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path='/parks' element={<Parks />} />
        {/* <Route path='/parks/:park_id' element={<ParkDetails />} /> */}
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path='/passport' element={<ProtectedRoute><Passport /></ProtectedRoute>} />
        <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
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
      <Toaster />
    </div>
  );
}
