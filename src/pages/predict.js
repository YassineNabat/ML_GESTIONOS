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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-800 mb-8 text-center">
          Prédiction des Ventes
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl">
          
          {/* Store Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Magasin</label>
            <Select
              value={(storeOptions || []).find(opt => opt.value === store) || null}
              onChange={handleStoreChange}
              options={storeOptions || []}
              className="w-full"
              classNamePrefix="select"
              placeholder="Sélectionnez un magasin"
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '2px',
                  borderColor: '#e2e8f0',
                  '&:hover': { borderColor: '#cbd5e1' }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white'
                })
              }}
            />
          </div>

          {/* Product Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">EAN</label>
            <Select
              value={(productOptions || []).find(opt => opt.value === product) || null}
              onChange={handleProductChange}
              options={productOptions || []}
              getOptionLabel={(opt) => opt.ean}
              className="w-full"
              classNamePrefix="select"
              placeholder="Sélectionnez un EAN"
              isDisabled={!store}
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '2px',
                  borderColor: '#e2e8f0',
                  '&:hover': { borderColor: '#cbd5e1' }
                })
              }}
            />
          </div>

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Produit</label>
            <input
              type="text"
              value={productLabel}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              placeholder="Nom du produit"
            />
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Période</label>
            <input
              type="text"
              id="flatpickr-range"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              placeholder="Sélectionnez une période"
            />
          </div>

          {/* Stock Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité en stock</label>
            <input
              type="number"
              value={stockQuantity}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
              placeholder="Quantité restante"
            />
          </div>

          {/* Action Buttons */}
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
                       rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] 
                       transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Prédire
            </button>
          </div>

          {/* Results */}
          {predictedQuantity !== null && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Résultat de la prédiction</h3>
              <p className="text-green-700">
                Quantité à commander recommandée : <span className="font-bold">{predictedQuantity}</span>
              </p>
            </div>
          )}

          {predictionError && (
            <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur</h3>
              <p className="text-red-700">{predictionError}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}