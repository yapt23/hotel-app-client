// src/components/Hero.js
import React from 'react';
import { Link } from 'react-router-dom'; // Impor Link
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Nikmati Pengalaman Menginap Terbaik</h1>
        <p>Kenyamanan dan kemewahan menanti Anda di jantung kota.</p>
        {/* Bungkus tombol dengan Link */}
        <Link to="/rooms">
          <button className="hero-button">Lihat Kamar</button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;