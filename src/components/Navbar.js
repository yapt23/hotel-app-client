// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // State untuk melacak kondisi menu (terbuka/tertutup)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fungsi untuk menutup menu (digunakan saat link diklik)
  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Hotel Ya Hotel
        </Link>
        
        {/* Ikon Burger/Close Menu */}
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '×' : '☰'}
        </div>
        
        {/* Tambahkan kelas 'active' jika menu terbuka */}
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-links" onClick={closeMobileMenu}>
              Kamar
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;