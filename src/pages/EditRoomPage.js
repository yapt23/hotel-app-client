// src/pages/EditRoomPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/AddRoomForm.css';

const EditRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // State untuk text input
    const [textData, setTextData] = useState({
        name: '', description: '', pricePerNight: '', maxGuests: '', facilities: '',
    });
    // State terpisah untuk file gambar
    const [images, setImages] = useState(null);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
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
    }, [id]);

    const handleChange = (e) => {
        setTextData({ ...textData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Gunakan FormData karena mungkin ada file upload
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
            await axios.put(`http://localhost:5000/api/rooms/${id}`, formData, {
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

    if (loading) return <p>Loading data kamar...</p>;

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