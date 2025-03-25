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
  const [predictedQuantity, setPredictedQuantity] = useState(null); // Nouvel état pour la prédiction
  const [predictionError, setPredictionError] = useState(null); // Nouvel état pour les erreurs de prédiction

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
    setProductEAN(selectedOption.ean);     // EAN
    setProductLabel(selectedOption.label); // Description du produit
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPredictedQuantity(null); // Réinitialiser la prédiction précédente
    setPredictionError(null);   // Réinitialiser les erreurs précédentes

    // Vérifier si tous les champs nécessaires sont remplis
    if (!store || !product || !startDate || !endDate) {
      setPredictionError("Veuillez sélectionner un magasin, un produit et une période.");
      return;
    }

    // Préparer les données à envoyer au backend
    const predictionData = {
      magasin: store, // Utiliser l'ID du magasin
      produit: productEAN, // Utiliser l'EAN du produit
      date_debut_consommation: startDate,
      date_fin_consommation: endDate,
      stock_actuel: stockQuantity ? parseInt(stockQuantity) : 0 // Inclure le stock actuel
    };

    // Envoyer la requête POST à l'endpoint de prédiction
    axios.post("http://127.0.0.1:5000/predict", predictionData)
      .then(response => {
        setPredictedQuantity(response.data.predicted_quantity);
      })
      .catch(error => {
        console.error("Erreur lors de la prédiction:", error);
        setPredictionError("Erreur lors de la prédiction. Veuillez réessayer.");
        if (error.response && error.response.data && error.response.data.error) {
          setPredictionError(`Erreur lors de la prédiction: ${error.response.data.error}`);
        }
      });
  };

  const handleCancel = () => {
    setStore("");
    setProduct("");
    setProductEAN("");
    setProductLabel("");
    setStartDate("");
    setEndDate("");
    setStockQuantity("");
    setPredictedQuantity(null); // Réinitialiser la quantité prédite
    setPredictionError(null);   // Réinitialiser les erreurs
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
              placeholder="YYYY-MM-DD to YYYY-MM-DD"
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

        {/* Affichage de la prédiction */}
        {predictedQuantity !== null && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-semibold">Quantité à commander prédite : {predictedQuantity}</p>
          </div>
        )}

        {/* Affichage des erreurs de prédiction */}
        {predictionError && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-semibold">Erreur : {predictionError}</p>
          </div>
        )}

      </form>
    </div>
  );
}