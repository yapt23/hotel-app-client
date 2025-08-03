// src/components/FeaturedRooms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeaturedRooms.css';
import Spinner from './Spinner'; // Impor Spinner

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil URL API dari environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Gunakan apiUrl untuk memanggil API
        const response = await axios.get(`${apiUrl}/api/rooms`);
        setRooms(response.data.slice(0, 3));
      } catch (err) {
        setError('Gagal memuat data kamar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [apiUrl]); // Tambahkan apiUrl sebagai dependency

  // Ganti teks loading dengan komponen Spinner
  if (loading) {
    return (
      <div className="featured-rooms-container">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="featured-rooms-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="featured-rooms-container">
      <h2>Kamar Unggulan Kami</h2>
      <div className="rooms-list">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            {/* Gunakan apiUrl untuk path gambar */}
            <img src={room.images[0] ? `${apiUrl}${room.images[0]}` : 'https://via.placeholder.com/400x300.png?text=No+Image'} alt={room.name} />
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