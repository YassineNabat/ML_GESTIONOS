import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://127.0.0.1:5000/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: token } }
      );
      setSuccess(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Changer le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Entrez votre nouveau mot de passe"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Confirmez votre nouveau mot de passe"
            />
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <p className="text-green-600 font-medium">{success}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg 
                     font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] 
                     transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Changer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
