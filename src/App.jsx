import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Settings from './pages/Settings';
import LayoutAdmin from './components/LayoutAdmin';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LandingPage /> },
    ]
  },
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      { path: "/settings", element: <Settings/> }
    ]
  },
    { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;