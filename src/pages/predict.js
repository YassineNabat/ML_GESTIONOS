import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function Predict() {
  const [store, setStore] = useState(""); // Store : identifiant du magasin
  const [product, setProduct] = useState(""); // Product : identifiant du produit
  const [productEAN, setProductEAN] = useState(""); // ProductEAN : identifiant du produit
  const [productLabel, setProductLabel] = useState(""); // Description du produit
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [storeOptions, setStoreOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // Récupération des magasins et produits
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/stores")
      .then(response => setStoreOptions(response.data))
      .catch(error => console.error("Erreur récupération magasins:", error));

    axios.get("http://127.0.0.1:5000/products")
      .then(response => {
        // On s'assure que chaque option a bien une valeur et un label séparés
        const formattedProducts = response.data.map(product => {
          const [ean, ...descriptionParts] = product.label.split(" : ");
          return {
            value: product.value, // ID du produit
            ean: ean, // L'EAN seul
            label: descriptionParts.join(" : ") // La description du produit
          };
        });
        setProductOptions(formattedProducts);
      })
      .catch(error => console.error("Erreur récupération produits:", error));
  }, []);

  // Récupération de la quantité en stock
  useEffect(() => {
    if (store && product) {
      axios.get(`http://127.0.0.1:5000/stock?store_id=${store}&product_id=${product}`)
        .then(response => {
          setStockQuantity(response.data.stock_quantity !== null ? response.data.stock_quantity : "");
        })
        .catch(error => {
          console.error("Erreur récupération stock:", error);
          setStockQuantity("");
        });
    } else {
      setStockQuantity("");
    }
  }, [store, product]);

  // Initialisation de flatpickr et gestion de la sélection de dates
  useEffect(() => {
    const fp = flatpickr("#flatpickr-range", {
      mode: 'range',
      dateFormat: "Y-m-d",
      onChange: (dates) => {
        if (dates.length === 2) {
          setStartDate(dates[0].toISOString().slice(0, 10));
          setEndDate(dates[1].toISOString().slice(0, 10));
        } else {
          setStartDate("");
          setEndDate("");
        }
      }
    });

    // Cleanup function to destroy flatpickr instance
    return () => {
      if (fp) {
        fp.destroy();
      }
    };
  }, []);

  // Gérer le changement de produit
  const handleProductChange = (selectedOption) => {
    setProduct(selectedOption.value);     // ID produit
    setProductEAN(selectedOption.ean);    // EAN
    setProductLabel(selectedOption.label); // Description du produit
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoie l'objet avec store et productEAN (noter que product correspond maintenant à store dans l'objet JSON)
    console.log({ store: product, product: productEAN, startDate, endDate, stockQuantity });
    // Ici, tu peux envoyer les données du formulaire à l'API avec les bons noms de variables
  };

  const handleCancel = () => {
    setStore("");
    setProduct("");
    setProductEAN("");
    setProductLabel("");
    setStartDate("");
    setEndDate("");
    setStockQuantity("");
    const flatpickrInstance = flatpickr.instances.find(fp => fp.element.id === 'flatpickr-range');
    if (flatpickrInstance) {
      flatpickrInstance.clear();
    }
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

        {/* Product Dropdown (EAN only) */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">EAN</label>
          <Select
            value={productOptions.find(opt => opt.value === product) || null}
            onChange={handleProductChange}
            options={productOptions} // Affiche l’EAN et conserve les autres données
            getOptionLabel={(opt) => opt.ean} // Force l'affichage de l'EAN dans la liste déroulante
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un EAN"
          />
        </div>

        {/* Readonly Input for Product Name */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Produit</label>
          <input
            type="text"
            value={productLabel}
            readOnly
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            placeholder="Nom du produit"
          />
        </div>

        {/* Date Range Picker */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Période</label>
          <div className="col-span-9 mt-2">
            <input
              type="text"
              className="input col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-stone-500 focus:ring-stone-500"
              placeholder="YYYY-MM-DD to<ctrl3348>-MM-DD"
              id="flatpickr-range"
            />
          </div>
        </div>

        {/* Stock Quantity */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Quantité restante</label>
          <input
            type="number"
            value={stockQuantity}
            readOnly
            className="col-span-9 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
            placeholder="Quantité restante"
          />
        </div>

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
