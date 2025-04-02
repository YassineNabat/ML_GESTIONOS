import { useState } from "react";
import axios from "axios";

export default function Train() {
  const [jsonInput, setJsonInput] = useState("{}");
  const [error, setError] = useState(null);
  const [trainMessage, setTrainMessage] = useState(null);

  const handleTrain = async (e) => {
    e.preventDefault();
    setError(null);
    setTrainMessage(null);

    try {
      const parsed = JSON.parse(jsonInput);

      const response = await axios.post("http://127.0.0.1:5000/train", parsed);

      if (response && response.data && response.data.message) {
        setTrainMessage({ type: "success", text: response.data.message });
        setJsonInput("{}");
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
    setError(null);
    setTrainMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Entraînement du Modèle</h2>

        <form onSubmit={handleTrain} className="bg-white p-8 rounded-xl shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="mb-6">
            <label htmlFor="jsonInput" className="block text-lg font-semibold text-gray-700 mb-3">
              Données d'entraînement (JSON)
            </label>
            <textarea
              id="jsonInput"
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="{&#10;  &quot;data&quot;: [&#10;    {&#10;      &quot;feature&quot;: &quot;value&quot;&#10;    }&#10;  ]&#10;}"
            ></textarea>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {trainMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              trainMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`font-medium ${
                trainMessage.type === 'success' ? 'text-green-600' : 'text-blue-600'
              }`}>{trainMessage.text}</p>
            </div>
          )}

          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 
                       transition-all duration-300 font-semibold focus:ring-2 focus:ring-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 
                       rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
                       font-semibold shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500"
            >
              Entraîner le Modèle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}