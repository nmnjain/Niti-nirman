import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import ProfilePage from './pages/profile';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;