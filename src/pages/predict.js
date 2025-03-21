import { useState } from "react";
import Select from "react-select";

export default function Predict() {
  // State pour chaque champ du formulaire
  const [store, setStore] = useState("");
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const stores = ["Magasin 1", "Magasin 2", "Magasin 3"];  // Remplace par tes magasins réels
  const products = ["Produit A", "Produit B", "Produit C"];  // Remplace par tes produits réels

  const storeOptions = stores.map(storeName => ({ label: storeName, value: storeName }));
  const productOptions = products.map(productName => ({ label: productName, value: productName }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour la prédiction
    console.log({
      store,
      product,
      startDate,
      endDate,
      stockQuantity,
    });
  };

  const handleCancel = () => {
    // Réinitialisation du formulaire
    setStore("");
    setProduct("");
    setStartDate("");
    setEndDate("");
    setStockQuantity("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-20">
      <h2 className="text-2xl font-semibold text-center mb-6">Prédire les ventes</h2>

      <form onSubmit={handleSubmit} className="bg-stone-200 p-6 shadow-xl rounded-md">
        {/* Magasin */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="store" className="col-span-3 text-sm font-semibold text-gray-700">Magasin</label>
          <Select
            id="store"
            value={store ? { label: store, value: store } : null}
            onChange={(selectedOption) => setStore(selectedOption.value)}
            options={storeOptions}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un magasin"
          />
        </div>

        {/* Produit */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="product" className="col-span-3 text-sm font-semibold text-gray-700">Produit</label>
          <Select
            id="product"
            value={product ? { label: product, value: product } : null}
            onChange={(selectedOption) => setProduct(selectedOption.value)}
            options={productOptions}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un produit"
          />
        </div>

        {/* Date de début */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="startDate" className="col-span-3 text-sm font-semibold text-gray-700">Date de début de vente</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Date de fin */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="endDate" className="col-span-3 text-sm font-semibold text-gray-700">Date de fin de vente</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Quantité de stock actuelle */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label htmlFor="stockQuantity" className="col-span-3 text-sm font-semibold text-gray-700">Quantité de stock actuelle</label>
          <input
            type="number"
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Ex: 100"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 stone-lg transition delay-100 duration-50 ease-in-out hover:-translate-y-0 hover:scale-110 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 hover:font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-stone-500 stone-lg transition delay-100 duration-50 ease-in-out hover:-translate-y-0 hover:scale-110 shadow-stone-500/50 px-6 py-2 rounded-md hover:bg-stone-700 text-slate-100 hover:font-semibold"
          >
            Prédire
          </button>
        </div>
      </form>
    </div>
  );
}
