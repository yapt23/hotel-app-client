// src/pages/HomePage.js
import React from 'react';
import Hero from '../components/Hero';
import FeaturedRooms from '../components/FeaturedRooms';

const HomePage = () => {
  return (
    <>
      <Hero />
      <main>
        <FeaturedRooms />
      </main>
    </>
  );
};

export default HomePage;