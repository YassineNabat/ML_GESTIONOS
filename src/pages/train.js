import { useState } from "react";

export default function Train() {
  const [jsonInput, setJsonInput] = useState("{}");
  const [ setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const handleParse = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedData(parsed);
      setError(null);
    } catch (err) {
      setError("Format JSON invalide");
      setParsedData(null);
    }
  };

  const handleCancel = () => {
    setJsonInput("{}");
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-20">
      <h2 className="text-2xl font-semibold text-center mb-6">Entraînement du Modèle</h2>

      <form onSubmit={handleParse} className="bg-stone-200 p-6 shadow-xl rounded-md">
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="jsonInput" className="col-span-3 text-sm font-semibold text-gray-700">
            JSON Input
          </label>
          <textarea
            id="jsonInput"
            className="col-span-9 mt-2 w-full p-2 border border-gray-300 rounded-md font-mono bg-gray-50"
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
            className="bg-gray-300 transition delay-100 duration-50 ease-in-out hover:-translate-y-0 hover:scale-110 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 hover:font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-stone-500 transition delay-100 duration-50 ease-in-out hover:-translate-y-0 hover:scale-110 shadow-stone-500/50 px-6 py-2 rounded-md hover:bg-stone-700 text-slate-100 hover:font-semibold"
          >
            Parser JSON
          </button>
        </div>
      </form>
    </div>
  );
}