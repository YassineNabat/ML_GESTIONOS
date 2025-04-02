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
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Changer le mot de passe</h2>
      <form onSubmit={handleChangePassword} className="bg-stone-200 p-6 shadow-xl rounded-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Mot de passe actuel</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entrez votre mot de passe actuel"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Entrez votre nouveau mot de passe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Confirmez votre nouveau mot de passe"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-stone-500 text-white py-2 rounded-md hover:bg-stone-700"
        >
          Changer le mot de passe
        </button>
      </form>
    </div>
  );
}
