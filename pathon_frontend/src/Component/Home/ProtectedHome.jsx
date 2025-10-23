import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../../Pages/Home/Home';
import Home1 from '../../Pages/Home/Home1';

const ProtectedHome = () => {
  // Helper to read auth data from localStorage
  const readAuth = () => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      
      const parsed = JSON.parse(raw);
      const token = parsed?.token ?? 
                   parsed?.accessToken ?? 
                   parsed?.data?.token ?? 
                   parsed?.data?.accessToken ?? 
                   parsed?.user?.token ?? 
                   null;
      
      return token ? parsed : null;
    } catch (err) {
      console.error("Error reading auth:", err);
      return null;
    }
  };

  const authData = readAuth();
  
  // If we have valid auth data, show Home1, otherwise show Home
  return authData ? <Home1 /> : <Home />;
};

export default ProtectedHome;