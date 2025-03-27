import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Train from './pages/train';
import Predict from './pages/predict';
import Login from './pages/login';
import Register from './pages/register';
import React from 'react';
import { useAuth } from './auth/useAuth';

// Composant pour protéger les routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated, logout } = useAuth();

 

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} /> {/* Protection ajoutée */}
          <Route path="/train" element={<PrivateRoute><Train /></PrivateRoute>} />
          <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      {isAuthenticated ? (
        <div>
          <h1>Bienvenue !</h1>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
