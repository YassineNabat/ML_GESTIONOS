import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", { username, password });
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Rediriger vers la page de connexion après 2 secondes
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>
      <form onSubmit={handleRegister} className="bg-stone-200 p-6 shadow-xl rounded-md">
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
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-stone-500 text-white py-2 rounded-md hover:bg-stone-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
