import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

export default function Predict() {
  const [store, setStore] = useState("");
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [storeOptions, setStoreOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Fetch stores and products from API
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/stores")
      .then(response => setStoreOptions(response.data))
      .catch(error => console.error("Error fetching stores:", error));

    axios.get("http://127.0.0.1:5000/products")
      .then(response => setProductOptions(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // Fetch stock quantity when store and product are selected
  useEffect(() => {
    if (store && product) {
      axios.get(`http://127.0.0.1:5000/stock?store_id=${store}&product_id=${product}`)
        .then(response => {
          setStockQuantity(response.data.stock_quantity !== null ? response.data.stock_quantity : "");
        })
        .catch(error => {
          console.error("Error fetching stock quantity:", error);
          setStockQuantity(""); // Clear stock quantity on error
        });
    } else {
      setStockQuantity(""); // Clear stock quantity if store or product is not selected
    }
  }, [store, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ store, product, startDate, endDate, stockQuantity });
    // Here you would typically send the data to your prediction API
  };

  const handleCancel = () => {
    setStore(""); setProduct(""); setStartDate(""); setEndDate(""); setStockQuantity("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-20">
      <h2 className="text-2xl font-semibold text-center mb-6">Prédire les ventes</h2>
      <form onSubmit={handleSubmit} className="bg-stone-200 p-6 shadow-xl rounded-md">

        {/* Store Dropdown */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Magasin</label>
          <Select
            value={storeOptions.find(opt => opt.value === store) || null}
            onChange={(selectedOption) => setStore(selectedOption.value)}
            options={storeOptions}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un magasin"
          />
        </div>

        {/* Product Dropdown */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Produit</label>
          <Select
            value={productOptions.find(opt => opt.value === product) || null}
            onChange={(selectedOption) => setProduct(selectedOption.value)}
            options={productOptions}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un produit"
          />
        </div>

        {/* Date Inputs */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Date de début</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                 className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md" />
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Date de fin</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                 className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md" />
        </div>

        {/* Stock Quantity */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Quantité restante</label>
          <input
            type="number"
            value={stockQuantity}
            readOnly // Make it read-only as it's fetched from the backend
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            placeholder="Quantité restante"
          />
        </div>

        {/* Manual Stock Quantity (Optional - if you still want to allow manual input) */}
        {/* <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Quantité de stock (prédiction)</label>
          <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)}
                 className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Ex: 100" />
        </div> */}

        {/* Buttons */}
        <div className="flex justify-between">
          <button type="button" onClick={handleCancel}
                  className="bg-gray-300 px-6 py-2 rounded-md hover:bg-gray-400">Annuler</button>
          <button type="submit"
                  className="bg-stone-500 px-6 py-2 rounded-md hover:bg-stone-700 text-white">Prédire</button>
        </div>
      </form>
    </div>
  );
}