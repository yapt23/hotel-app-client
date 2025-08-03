import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Impor Komponen dan Halaman
import PublicLayout from './components/PublicLayout'; // Impor layout baru
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AllRooms from './pages/AllRooms';
import RoomDetailPage from './pages/RoomDetailPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import EditRoomPage from './pages/EditRoomPage';

import './App.css';

function App() {
  return (
    <Router>
      {/* Navbar sudah tidak ada di sini */}
      <div className="App">
        <Routes>
          {/* === Rute Publik (Dengan Navbar) === */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
          </Route>

          {/* === Rute Admin & Login (Tanpa Navbar) === */}
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          {/* Rute Edit yang Dilindungi */}
          <Route 
            path="/admin/edit-room/:id" 
            element={
              <ProtectedRoute>
                <EditRoomPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;