import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { username, password });
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token); // Stocker le token dans localStorage
        navigate("/dashboard"); // Rediriger vers le tableau de bord
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la connexion.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>
      <form onSubmit={handleLogin} className="bg-stone-200 p-6 shadow-xl rounded-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entrez votre mot de passe"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-stone-500 text-white py-2 rounded-md hover:bg-stone-700"
        >
          Se connecter
        </button>
        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-stone-500 hover:underline">
            Créer un compte
          </a>
        </p>
      </form>
    </div>
  );
}
