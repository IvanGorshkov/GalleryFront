import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import Products from './pages/Art';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import CreateArt from './pages/CreateArt';
import EditArt from './pages/EditArt';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'gallery', element: <Gallery /> },
        { path: 'user', element: <User /> },
        { path: 'newexhibition', element: <Products /> },
        { path: 'new_art', element: <CreateArt /> },
        { path: 'edit_art/:id', element: <EditArt /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/gallery" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
