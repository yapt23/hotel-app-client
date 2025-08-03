// src/components/FeaturedRooms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan axios sudah terinstall
import './FeaturedRooms.css';
import Spinner from './Spinner';

const FeaturedRooms = () => {
  // State untuk menyimpan data kamar, status loading, dan error
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect akan berjalan sekali saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Panggil API back-end Anda
        const response = await axios.get('http://localhost:5000/api/rooms');
        // Ambil hanya 3 kamar pertama untuk ditampilkan sebagai unggulan
        setRooms(response.data.slice(0, 3));
      } catch (err) {
        setError('Gagal memuat data kamar. Pastikan server back-end berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // Tampilkan pesan loading
  if (loading) {
    return <div className="featured-rooms-container"><p>Loading kamar unggulan...</p></div>;
  }

  // Tampilkan pesan error jika terjadi masalah
  if (error) {
    return <div className="featured-rooms-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="featured-rooms-container">
      <h2>Kamar Unggulan Kami</h2>
      <div className="rooms-list">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            {/* Gunakan gambar pertama dari array images, atau gambar placeholder */}
            <img src={room.images[0] ? `http://localhost:5000${room.images[0]}` : 'https://via.placeholder.com/400x300.png?text=No+Image'} alt={room.name} />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>Mulai dari Rp {room.pricePerNight.toLocaleString('id-ID')}/malam</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRooms;