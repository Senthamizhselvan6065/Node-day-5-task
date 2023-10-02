import React from 'react';
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Signin from './Components/Register';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
export let url = "http://localhost:7000/api/user"

const App = () => {
  const router = createBrowserRouter([
      {
          path: "/",
          element: <Signin />
      },
      {
          path: "/login",
          element: <Login />
      },
      {
        path: "/forgot/password",
        element: <ForgotPassword />
      },
      {
        path: "/reset/password/:token",
        element: <ResetPassword />
      }
  ])
  return (
    <div className='app'>
        <RouterProvider router={router} />
    </div>
  )
}

export default App