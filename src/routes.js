/* eslint-disable */
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import Chat from './pages/Chat';
import NotFound from './pages/Page404';
import Main from './pages/Main';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ImportantNotice from './pages/ImportantNotice';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/tikitaka',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/main" replace /> },
        { path: 'main', element: <Main /> },
        { path: 'importantNotice', element: <ImportantNotice /> }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'chat', element: <Chat /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        // { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: '/login', element: <Login /> },
        { path: 'forgotPassword', element: <ForgotPassword />},
        { path: 'resetPassword', element: <ResetPassword />}
      ]
    },
    // { path: '/login', element: <Login /> },
    { path: '*', element: <Navigate to="/404" replace /> }
    // { path: 'forgotPassword', element: <ForgotPassword />},
    // { path: 'resetPassword', element: <ResetPassword />}
  ]);
}