import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

function LayoutAdmin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;