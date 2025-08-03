// src/pages/EditRoomPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/AddRoomForm.css';
import Spinner from '../components/Spinner';

const EditRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [textData, setTextData] = useState({
        name: '', description: '', pricePerNight: '', maxGuests: '', facilities: '',
    });
    const [images, setImages] = useState(null);

    // Ambil URL API dari environment variable
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // Gunakan apiUrl untuk mengambil data
                const response = await axios.get(`${apiUrl}/api/rooms/${id}`);
                const { name, description, pricePerNight, maxGuests, facilities } = response.data;
                setTextData({
                    name, description, pricePerNight, maxGuests,
                    facilities: facilities.join(', '),
                });
                setLoading(false);
            } catch (error) {
                alert("Gagal mengambil data kamar.");
                setLoading(false);
            }
        };
        fetchRoomData();
    }, [id, apiUrl]); // Tambahkan apiUrl sebagai dependency

    const handleChange = (e) => {
        setTextData({ ...textData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.keys(textData).forEach(key => {
            formData.append(key, textData[key]);
        });

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }
        
        try {
            // Gunakan apiUrl untuk endpoint update
            await axios.put(`${apiUrl}/api/rooms/${id}`, formData, {
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Data kamar berhasil diperbarui!');
            navigate('/admin');
        } catch (error) {
            alert('Gagal memperbarui data kamar.');
            console.error(error);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="login-container">
            <div className="add-room-form-container">
                <h3>Edit Kamar</h3>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={textData.name} onChange={handleChange} placeholder="Nama Kamar" required />
                    <textarea name="description" value={textData.description} onChange={handleChange} placeholder="Deskripsi Kamar" required />
                    <input name="pricePerNight" type="number" value={textData.pricePerNight} onChange={handleChange} placeholder="Harga per Malam" required />
                    <input name="maxGuests" type="number" value={textData.maxGuests} onChange={handleChange} placeholder="Kapasitas Tamu" required />
                    <input name="facilities" value={textData.facilities} onChange={handleChange} placeholder="Fasilitas (pisahkan dengan koma)" />
                    
                    <label>Upload Gambar Baru (opsional, akan menggantikan semua gambar lama)</label>
                    <input name="images" type="file" onChange={handleFileChange} multiple />

                    <button type="submit">Simpan Perubahan</button>
                </form>
            </div>
        </div>
    );
};

export default EditRoomPage;