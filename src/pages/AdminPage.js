// src/pages/AdminPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Pastikan useNavigate & Link diimpor
import axios from 'axios';
import AddRoomForm from '../components/AddRoomForm';
import './AdminPage.css';
import Spinner from '../components/Spinner';

const AdminPage = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate(); // Inisialisasi useNavigate

    // Fungsi untuk mengambil semua data (booking & kamar)
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': token } };

            // Ambil data booking dan kamar secara bersamaan
            const [bookingsRes, roomsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/bookings', config),
                axios.get('http://localhost:5000/api/rooms') // Endpoint rooms tidak perlu token
            ]);
            
            setBookings(bookingsRes.data);
            setRooms(roomsRes.data);
            setError(null);
        } catch (err) {
            setError('Gagal mengambil data dari server.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fungsi untuk Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Fungsi yang dipanggil setelah kamar berhasil ditambah
    const handleRoomAdded = () => {
        setShowAddForm(false);
        alert("Kamar baru telah ditambahkan.");
        fetchData(); // Ambil data ulang untuk menampilkan kamar baru
    };

    // Fungsi untuk menghapus kamar
    const handleDeleteRoom = async (roomId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
                    headers: { 'Authorization': token }
                });
                alert('Kamar berhasil dihapus.');
                fetchData(); // Ambil data ulang untuk menghapus kamar dari daftar
            } catch (err) {
                alert('Gagal menghapus kamar.');
                console.error(err);
            }
        }
    };

    if (loading) return <Spinner />;
    if (error) return <div className="admin-status error">{error}</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Dashboard Admin</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <button onClick={() => setShowAddForm(!showAddForm)} className="toggle-form-button">
                {showAddForm ? 'Tutup Form Tambah Kamar' : 'Tambah Kamar Baru'}
            </button>
            
            {showAddForm && <AddRoomForm onRoomAdded={handleRoomAdded} />}

            <h2 className="section-title">Manajemen Kamar</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Kamar</th>
                            <th>Harga per Malam</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id}>
                                <td>{room.name}</td>
                                <td>Rp {room.pricePerNight.toLocaleString('id-ID')}</td>
                                <td className="action-cell">
                                    <Link to={`/admin/edit-room/${room._id}`}>
                                        <button className="action-button edit">Edit</button>
                                    </Link>
                                    <button onClick={() => handleDeleteRoom(room._id)} className="action-button delete">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="section-title">Daftar Booking</h2>
            <div className="table-container">
                <table>
                     <thead>
                        <tr>
                            <th>Nama Tamu</th>
                            <th>Email</th>
                            <th>Nama Kamar</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking.guestName}</td>
                                <td>{booking.guestEmail}</td>
                                <td>{booking.room ? booking.room.name : 'Kamar Dihapus'}</td>
                                <td>{new Date(booking.checkInDate).toLocaleDateString('id-ID')}</td>
                                <td>{new Date(booking.checkOutDate).toLocaleDateString('id-ID')}</td>
                                <td>Rp {booking.totalPrice.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;