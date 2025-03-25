import { useState } from "react";
import axios from "axios";

export default function Train() {
  const [jsonInput, setJsonInput] = useState("{}");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [trainMessage, setTrainMessage] = useState(null); // Nouvel état pour les messages d'entraînement

  const handleTrain = async (e) => {
    e.preventDefault();
    setParsedData(null);
    setError(null);
    setTrainMessage(null); // Réinitialiser le message d'entraînement

    try {
      const parsed = JSON.parse(jsonInput);
      setParsedData(parsed);

      // Envoyer les données JSON au backend pour l'entraînement
      const response = await axios.post("http://127.0.0.1:5000/train", parsed);

      // Gérer la réponse du backend
      if (response && response.data && response.data.message) {
        setTrainMessage({ type: "success", text: response.data.message });
        setJsonInput("{}"); // Réinitialiser le champ JSON après un succès
      } else {
        setTrainMessage({ type: "info", text: "L'entraînement s'est terminé, mais la réponse du serveur est inattendue." });
      }

    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Format JSON invalide");
      } else if (axios.isAxiosError(err)) {
        setError(`Erreur lors de l'envoi des données d'entraînement: ${err.response?.data?.error || err.message}`);
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
      setTrainMessage(null);
    }
  };

  const handleCancel = () => {
    setJsonInput("{}");
    setParsedData(null);
    setError(null);
    setTrainMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-20">
      <h2 className="text-2xl font-semibold text-center mb-6">Entraînement du Modèle</h2>

      <form onSubmit={handleTrain} className="bg-stone-200 p-6 shadow-xl rounded-md border border-gray-300">
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="jsonInput" className="col-span-3 text-sm font-semibold text-gray-700">
            JSON Input
          </label>
          <textarea
            id="jsonInput"
            className="col-span-9 mt-2 w-full p-2 border border-gray-300 rounded-md font-mono bg-gray-50 focus:ring-2 focus:ring-stone-500 focus:outline-none"
            rows="6"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Entrez le JSON ici..."
          ></textarea>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 transition-transform transform hover:scale-105 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 hover:font-semibold focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-stone-500 transition-transform transform hover:scale-105 shadow-stone-500/50 px-6 py-2 rounded-md hover:bg-stone-700 text-slate-100 hover:font-semibold focus:ring-2 focus:ring-stone-700 focus:outline-none"
          >
            Entraîner le Modèle
          </button>
        </div>
      </form>

      {trainMessage && (
        <div className={`mt-4 p-4 rounded-md ${trainMessage.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-blue-100 border border-blue-400 text-blue-700'}`}>
          <p>{trainMessage.text}</p>
        </div>
      )}
    </div>
  );
}