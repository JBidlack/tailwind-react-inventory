import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Checkout from './components/body/checkout/checkout';
import Checkin from './components/body/invCheckin/checkIn';
import LogIn from './components/login/login'
import SignUp from './components/signup/signup'
import axios from 'axios';
import './App.css';

function App() {

  // Declare axios default url here to prevent unneeded repetition
  
  axios.defaults.baseURL= 'https://inventory-backend-g3hs.onrender.com';

  return (
    <Router >
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='login' element= {<LogIn />} />
          <Route path='logged' element={<Header/>}>
            <Route path='checkout' element={<Checkout />} />
            <Route path='checkin' element={<Checkin />} />
          </Route>
        </Routes>
    </Router>
  );
}

export default App

export const server = axios.defaults.baseURL= 'https://inventory-backend-g3hs.onrender.com';
