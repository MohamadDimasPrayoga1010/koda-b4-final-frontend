import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'



const router = createBrowserRouter([
  {path: "/register", element: <Register />},
  {path: "/login", element: <Login />}
])
const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App