import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Outlet akan merender komponen halaman (misal: HomePage) */}
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;