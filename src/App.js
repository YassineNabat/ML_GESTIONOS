import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Train from './pages/train';
import Predict from './pages/predict';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import React from 'react';
import { useAuth } from './auth/useAuth';
import Sidebar from './components/sidebar';
import ChangePassword from './pages/changePassword';

// Composant pour protéger les routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  return token ? (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">{children}</div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Redirection conditionnelle pour la page Home */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/home"} />} />
          <Route path="/home" element={<Home />} />
          {/* Routes protégées avec Sidebar */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/train" element={<PrivateRoute><Train /></PrivateRoute>} />
          <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
