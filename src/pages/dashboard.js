export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Statistiques */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistiques</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Prédictions totales: <span className="text-blue-600 font-semibold">150</span></p>
              <p className="text-gray-600">Précision moyenne: <span className="text-green-600 font-semibold">95%</span></p>
            </div>
          </div>

          {/* Carte Actions Rapides */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors duration-300">
                Nouvelle Prédiction
              </button>
              <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors duration-300">
                Voir les Rapports
              </button>
            </div>
          </div>

          {/* Carte Activité Récente */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Activité Récente</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Prédiction effectuée pour Magasin A
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Modèle mis à jour
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
