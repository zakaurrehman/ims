'use client';

import React, { useState } from 'react';
import NavbarContent from './navbarContent';
import NavbarLinks from './navbarLinks';
import NavbarMenu from './navbarMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-br from-white via-[var(--endeavour)] to-[var(--port-gore)] shadow-lg z-50">
      <NavbarContent isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}>
        <NavbarLinks />
        <NavbarMenu isMenuOpen={isMenuOpen} />
      </NavbarContent>
    </nav>
  );
}
