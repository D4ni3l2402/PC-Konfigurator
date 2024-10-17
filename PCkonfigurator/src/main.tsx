import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Header from './components/Header/Header.tsx'
import Konfigurator from './components/Konfigurator/Konfigurator.tsx'
import FertigPC from './components/FertigPC/FertigPC.tsx'
import Impressum from './components/Impressum/Impressum.tsx'
import Footer from './components/Footer/Footer.tsx'
import CPU from './components/CPU/CPU.tsx'
import { BrandProvider } from './context/BrandContext.tsx'
import GPU from './components/GPU/GPU.tsx'
import Login from './components/Login/Login.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Register from './components/Register/Register.tsx'
import Account from './components/Account/Account.tsx'
import Shoppingcart from './components/Shoppingcart/Shoppingcart.tsx'



const router = createBrowserRouter([
  {
    path: '/',
    element:
      <React.StrictMode>
        <Header />
        <App />
        <Footer />
      </React.StrictMode>
  },
  {
    path: '/konfigurator',
    element:
      <>
        <BrandProvider>
          <Header />
          <Konfigurator />
          <Footer />
        </BrandProvider>
      </>
  },
  {
    path: '/konfigurator/cpu',
    element:
      <>
        <BrandProvider>
          <Header />
          <CPU />
          <Footer />
        </BrandProvider>
      </>
  },
  {
    path: '/konfigurator/gpu',
    element:
      <>
        <BrandProvider>
          <Header />
          <GPU />
          <Footer />
        </BrandProvider>
      </>
  },
  {
    path: '/fertigpc',
    element:
      <>
        <Header />
        <FertigPC />
        <Footer />
      </>
  },
  {
    path: '/impressum',
    element:
      <>
        <Header />
        <Impressum />
        <Footer />
      </>
  },
  {
    path: '/cart',
    element:
      <>
        <Header />
        <Shoppingcart />
        <Footer />
      </>
  },
  {
    path: '/login',
    element:
      <>
        <Header />
        <Login />
        <Footer />
      </>
  },
  {
    path: '/register',
    element:
      <>
        <Header />
        <Register />
        <Footer />
      </>
  },
  {
    path: '/account',
    element:
      <>
        <Header />
        <Account />
        <Footer />
      </>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

