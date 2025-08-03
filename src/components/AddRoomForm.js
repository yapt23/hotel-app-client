// src/components/AddRoomForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddRoomForm.css';

const AddRoomForm = ({ onRoomAdded }) => {
    const [textData, setTextData] = useState({
        name: '',
        description: '',
        pricePerNight: '',
        maxGuests: '',
        facilities: '',
    });
    const [images, setImages] = useState(null);

    // Ambil URL API dari environment variable
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleTextChange = (e) => {
        setTextData({ ...textData, [e.target.name]: e.target.value });
    };
    
    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Anda harus login.");
            return;
        }

        const formData = new FormData();
        formData.append('name', textData.name);
        formData.append('description', textData.description);
        formData.append('pricePerNight', textData.pricePerNight);
        formData.append('maxGuests', textData.maxGuests);
        formData.append('facilities', textData.facilities);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }
        
        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            // Gunakan apiUrl untuk endpoint create
            const response = await axios.post(`${apiUrl}/api/rooms`, formData, config);
            alert(response.data.message);
            onRoomAdded();
        } catch (error) {
            alert('Gagal menambah kamar: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="add-room-form-container">
            <h3>Tambah Kamar Baru</h3>
            <form onSubmit={handleSubmit}>
                <input name="name" value={textData.name} onChange={handleTextChange} placeholder="Nama Kamar" required />
                <textarea name="description" value={textData.description} onChange={handleTextChange} placeholder="Deskripsi Kamar" required />
                <input name="pricePerNight" type="number" value={textData.pricePerNight} onChange={handleTextChange} placeholder="Harga per Malam" required />
                <input name="maxGuests" type="number" value={textData.maxGuests} onChange={handleTextChange} placeholder="Kapasitas Tamu" required />
                <input name="facilities" value={textData.facilities} onChange={handleTextChange} placeholder="Fasilitas (pisahkan dengan koma)" />
                
                <label>Gambar Kamar (bisa lebih dari satu)</label>
                <input name="images" type="file" onChange={handleFileChange} multiple />
                
                <button type="submit">Simpan Kamar</button>
            </form>
        </div>
    );
};

export default AddRoomForm;