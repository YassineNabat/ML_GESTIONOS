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

  const [storeOptions, setStoreOptions] = useState();
  const [productOptions, setProductOptions] = useState();
  const [hasStoreBeenSelected, setHasStoreBeenSelected] = useState(false); // NOUVEL ÉTAT

  // Récupération des magasins
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/stores")
      .then(response => setStoreOptions(response.data))
      .catch(error => console.error("Erreur récupération magasins:", error));
  }, []);

  // Récupération des produits en fonction du magasin sélectionné (MODIFIÉ)
  useEffect(() => {
    if (store && !hasStoreBeenSelected) {
      axios.get(`http://127.0.0.1:5000/products?store_id=${store}`)
        .then(response => {
          const formattedProducts = response.data.map(product => {
            const [ean, ...descriptionParts] = product.label.split(" : ");
            return {
              value: product.value,
              ean: ean,
              label: descriptionParts.join(" : ")
            };
          });
          setProductOptions(formattedProducts);
          setProduct("");
          setProductEAN("");
          setProductLabel("");
          setHasStoreBeenSelected(true); // Marquer la récupération comme effectuée
        })
        .catch(error => console.error("Erreur récupération produits:", error));
    } else if (!store) {
      // Réinitialiser l'état si aucun magasin n'est sélectionné
      setProductOptions();
      setProduct("");
      setProductEAN("");
      setProductLabel("");
      setHasStoreBeenSelected(false); // Permettre une nouvelle récupération si un magasin est sélectionné à nouveau
    }
  }, [store, hasStoreBeenSelected]);

  // Récupération de la quantité en stock (inchangé)
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

  // Initialisation de flatpickr et gestion de la sélection de dates (inchangé)
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

    return () => {
      if (fp) {
        fp.destroy();
      }
    };
  }, []);

  // Gérer le changement de produit (inchangé)
  const handleProductChange = (selectedOption) => {
    setProduct(selectedOption.value);     // ID produit
    setProductEAN(selectedOption.ean);     // EAN
    setProductLabel(selectedOption.label); // Description du produit
  };

  // Gérer le changement de magasin (NOUVELLE FONCTION)
  const handleStoreChange = (selectedOption) => {
    setStore(selectedOption.value);
    setHasStoreBeenSelected(false); // Réinitialiser le flag lorsqu'un nouveau magasin est sélectionné
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    setPredictedQuantity(null);
    setPredictionError(null);

    if (!store || !product || !startDate || !endDate) {
      setPredictionError("Veuillez sélectionner un magasin, un produit et une période.");
      return;
    }

    const predictionData = {
      magasin: store,
      produit: productEAN,
      date_debut_consommation: startDate,
      date_fin_consommation: endDate,
      stock_actuel: stockQuantity ? parseInt(stockQuantity) : 0
    };

    console.log("Données envoyées pour la prédiction :", predictionData); // AJOUTER CETTE LIGNE

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

        {/* Store Dropdown (MODIFIÉ - Utilise handleStoreChange) */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">Magasin</label>
          <Select
            value={(storeOptions || []).find(opt => opt.value === store) || null}
            onChange={handleStoreChange} // Utiliser la nouvelle fonction
            options={storeOptions || []}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un magasin"
          />
        </div>

        {/* Product Dropdown (EAN only) (inchangé) */}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <label className="col-span-3 text-sm font-semibold text-gray-700">EAN</label>
          <Select
            value={(productOptions || []).find(opt => opt.value === product) || null}
            onChange={handleProductChange}
            options={productOptions || []}
            getOptionLabel={(opt) => opt.ean}
            className="col-span-9 mt-2 w-full"
            placeholder="Sélectionnez un EAN"
          />
        </div>

        {/* Readonly Input for Product Name (inchangé) */}
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

        {/* Date Range Picker (inchangé) */}
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

        {/* Stock Quantity (inchangé) */}
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

        {/* Buttons (inchangé) */}
        <div className="flex justify-between">
          <button type="button" onClick={handleCancel}
            className="bg-gray-300 px-6 py-2 rounded-md hover:bg-gray-400">Annuler</button>
          <button type="submit"
            className="bg-stone-500 px-6 py-2 rounded-md hover:bg-stone-700 text-white">Prédire</button>
        </div>

        {/* Affichage de la prédiction (inchangé) */}
        {predictedQuantity !== null && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="font-semibold">Quantité à commander prédite : {predictedQuantity}</p>
          </div>
        )}

        {/* Affichage des erreurs de prédiction (inchangé) */}
        {predictionError && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-semibold">Erreur : {predictionError}</p>
          </div>
        )}

      </form>
    </div>
  );
}