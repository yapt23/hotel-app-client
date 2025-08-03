// src/pages/AllRooms.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AllRooms.css'; // Pastikan file CSS ini diimpor
import Spinner from '../components/Spinner';

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil URL API dari environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        // Gunakan variabel apiUrl untuk memanggil API
        const response = await axios.get(`${apiUrl}/api/rooms`);
        setRooms(response.data);
      } catch (err) {
        setError('Gagal memuat data kamar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRooms();
  }, [apiUrl]); // Tambahkan apiUrl sebagai dependency

  if (loading) return <Spinner />;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Pilihan Kamar Terbaik</h1>
        <p>Temukan kenyamanan yang sempurna untuk liburan atau perjalanan bisnis Anda.</p>
      </header>
      
      <main className="rooms-content-grid">
        {rooms.map(room => (
          <div key={room._id} className="room-card-v2">
            <img 
                // Gunakan variabel apiUrl untuk path gambar
                src={room.images[0] ? `${apiUrl}${room.images[0]}` : 'https://via.placeholder.com/400x300.png?text=No+Image'}
                alt={room.name} 
                className="room-card-img"
            />
            <div className="room-card-body">
              <h3 className="room-card-title">{room.name}</h3>
              <p className="room-card-price">
                Rp {room.pricePerNight.toLocaleString('id-ID')}
                <span> / malam</span>
              </p>
              <p className="room-card-description">{room.description.substring(0, 100)}...</p>
              <Link to={`/rooms/${room._id}`} className="room-card-button">
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AllRooms;