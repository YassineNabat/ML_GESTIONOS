import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Inscription</h2>
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Choisissez un nom d'utilisateur"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Choisissez un mot de passe"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 bg-green-50 p-3 rounded-lg">{success}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            S'inscrire
          </button>
          <p className="text-sm text-center mt-6 text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
