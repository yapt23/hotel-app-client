// src/components/FeaturedRooms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeaturedRooms.css'; // Pastikan impor ini benar
import Spinner from './Spinner';

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      if (!apiUrl) {
        console.error("REACT_APP_API_URL is not defined");
        setError('Konfigurasi API URL belum diatur.');
        setLoading(false);
        return;
      }
      try {
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
  }, [apiUrl]);

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