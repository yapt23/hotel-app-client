// src/pages/RoomDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from '../components/Spinner';
import './RoomDetailPage.css';

const RoomDetailPage = () => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // State untuk form booking
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [availability, setAvailability] = useState({ status: 'idle', message: '' });

    // Ambil URL API dari environment variable
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRoomDetail = async () => {
            try {
                // Gunakan apiUrl untuk memanggil API
                const response = await axios.get(`${apiUrl}/api/rooms/${id}`);
                setRoom(response.data);
            } catch (err) {
                setError('Gagal memuat detail kamar atau kamar tidak ditemukan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomDetail();
    }, [id, apiUrl]); // Tambahkan apiUrl sebagai dependency

    const handleCheckAvailability = async () => {
        if (!checkInDate || !checkOutDate) {
            alert('Pilih tanggal check-in dan check-out terlebih dahulu.');
            return;
        }
        setAvailability({ status: 'checking', message: '' });
        try {
            const response = await axios.post(`${apiUrl}/api/bookings/check-availability`, {
                roomId: room._id,
                checkInDate,
                checkOutDate
            });
            if (response.data.available) {
                setAvailability({ status: 'available', message: response.data.message });
            } else {
                setAvailability({ status: 'unavailable', message: response.data.message });
            }
        } catch (err) {
            setAvailability({ status: 'error', message: 'Gagal memeriksa ketersediaan.' });
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (numberOfNights <= 0 || !guestName || !guestEmail) {
            alert('Harap lengkapi semua data dan pilih tanggal yang valid.');
            return;
        }

        if (availability.status !== 'available') {
            alert('Harap cek ketersediaan kamar terlebih dahulu.');
            return;
        }

        const totalPrice = numberOfNights * room.pricePerNight;
        const bookingData = {
            room: room._id,
            checkInDate,
            checkOutDate,
            guestName,
            guestEmail,
            totalPrice,
        };

        try {
            const response = await axios.post(`${apiUrl}/api/bookings`, bookingData);
            alert(response.data.message + " Detail akan dikirim ke email Anda.");
            navigate('/'); // Arahkan ke homepage setelah booking sukses
        } catch (err) {
            alert('Terjadi kesalahan saat membuat booking. Silakan coba lagi.');
            console.error(err);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="status-text error">{error}</p>;
    if (!room) return <p className="status-text">Kamar tidak ditemukan.</p>;

    return (
        <div className="room-detail-container">
            <h1>{room.name}</h1>
            <div className="image-gallery">
                {/* Gunakan apiUrl untuk path gambar */}
                <img src={`${apiUrl}${room.images[0]}`} alt={room.name} className="main-image" />
                <div className="thumbnail-images">
                    {room.images.slice(1).map((img, index) => (
                        <img key={index} src={`${apiUrl}${img}`} alt={`${room.name} thumbnail ${index + 1}`} />
                    ))}
                </div>
            </div>
            <div className="details-content">
                <div className="main-details">
                    <h2>Deskripsi</h2>
                    <p>{room.description}</p>
                    <h2>Fasilitas Unggulan</h2>
                    <ul className="facilities-grid">
                        {room.facilities.map(facility => <li key={facility}>{facility}</li>)}
                    </ul>
                </div>
                <form className="booking-box" onSubmit={handleBookingSubmit}>
                    <h3>Pesan Sekarang</h3>
                    <div className="price-section">
                        <p className="price">Rp {room.pricePerNight.toLocaleString('id-ID')}</p>
                        <p className="price-label">per malam</p>
                    </div>
                    <div className="form-group">
                        <label>Check-in</label>
                        <DatePicker
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={new Date()}
                            placeholderText="Pilih tanggal"
                            dateFormat="dd/MM/yyyy"
                            className="datepicker-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Check-out</label>
                        <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate || new Date()}
                            placeholderText="Pilih tanggal"
                            dateFormat="dd/MM/yyyy"
                            className="datepicker-input"
                        />
                    </div>
                    <button type="button" className="check-availability-button" onClick={handleCheckAvailability}>
                        {availability.status === 'checking' ? 'Mengecek...' : 'Cek Ketersediaan'}
                    </button>
                    {availability.message && (
                        <p className={`availability-status ${availability.status}`}>
                            {availability.message}
                        </p>
                    )}
                    {availability.status === 'available' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="guestName">Nama Lengkap</label>
                                <input type="text" id="guestName" placeholder="Nama Anda" value={guestName} onChange={(e) => setGuestName(e.target.value)} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="guestEmail">Email</label>
                                <input type="email" id="guestEmail" placeholder="email@anda.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required/>
                            </div>
                            <button type="submit" className="book-now-button">Booking Sekarang</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RoomDetailPage;