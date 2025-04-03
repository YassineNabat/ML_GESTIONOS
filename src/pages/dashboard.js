import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants ChartJS nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageAccuracy: 0,
    recentPredictions: []
  });

  useEffect(() => {
    // Simuler le chargement des données depuis l'API
    // Dans un cas réel, vous appelleriez votre API ici
    setStats({
      totalPredictions: 278,
      averageAccuracy: 92.5,
      recentPredictions: [
        { date: '2024-01-15', magasin: 'Magasin Paris', quantite: 150 },
        { date: '2024-01-14', magasin: 'Magasin Lyon', quantite: 200 },
        { date: '2024-01-13', magasin: 'Magasin Marseille', quantite: 175 }
      ]
    });
  }, []);

  useEffect(() => {
    // Fetch recent predictions from the database
    axios.get('http://127.0.0.1:5000/recent-predictions')
      .then(response => {
        setStats(prevStats => ({
          ...prevStats,
          recentPredictions: response.data
        }));
      })
      .catch(error => console.error("Erreur lors de la récupération des prédictions :", error));
  }, []);

  // Configuration du graphique
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Quantité prédite',
        data: [1200, 1500, 1800, 1650, 1950, 2000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Commandes réelles',
        data: [1180, 1450, 1820, 1600, 1900, 2100],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
      }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 px-4 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
            Tableau de Bord - Système de Prédiction de Stock
          </h1>
        </div>
      </header>
      
      <main className="p-6">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prédictions Totales</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalPredictions}</p>
            <p className="text-sm text-gray-500 mt-2">Depuis la création</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Précision Moyenne</h3>
            <p className="text-3xl font-bold text-green-600">{stats.averageAccuracy}%</p>
            <p className="text-sm text-gray-500 mt-2">Sur les 30 derniers jours</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">État du Modèle</h3>
            <p className="text-3xl font-bold text-purple-600">Actif</p>
            <p className="text-sm text-gray-500 mt-2">Dernière mise à jour : Aujourd'hui</p>
          </div>
        </div>

        {/* Graphique et Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Prédictions vs Commandes Réelles</h3>
            <div className="h-[300px]">
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions Rapides</h3>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/predict')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
              >
                Nouvelle Prédiction
              </button>
              <button 
                onClick={() => navigate('/train')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold"
              >
                Entraîner le Modèle
              </button>
              <button 
                onClick={() => navigate('/change-password')}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-semibold"
              >
                Paramètres du Compte
              </button>
            </div>
          </div>
        </div>

        {/* Dernières Prédictions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dernières Prédictions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Magasin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EAN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité Prédite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentPredictions.map((pred, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pred.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pred.magasin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pred.ean}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pred.quantite_predite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
