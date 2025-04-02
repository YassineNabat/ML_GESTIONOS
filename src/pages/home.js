export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec animation et dégradé */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-6xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 transform transition-all duration-500 hover:scale-105">
            Prédiction de Stock Intelligente
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Optimisez votre gestion de stock avec l'intelligence artificielle
          </p>
          <button className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold 
                           hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 
                           shadow-lg hover:shadow-xl">
            Commencer maintenant
          </button>
        </div>
      </div>

      {/* Section Caractéristiques avec cartes animées */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Fonctionnalités Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
                          transition-all duration-300 border border-gray-100">
              <div className="text-blue-500 mb-4">
                <span className="material-icons text-4xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Analyse Prédictive</h3>
              <p className="text-gray-600">
                Anticipez vos besoins en stock avec une précision inégalée grâce à nos algorithmes avancés.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
                          transition-all duration-300 border border-gray-100">
              <div className="text-green-500 mb-4">
                <span className="material-icons text-4xl">trending_up</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Optimisation Continue</h3>
              <p className="text-gray-600">
                Notre système s'améliore en continu pour des prédictions toujours plus précises.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
                          transition-all duration-300 border border-gray-100">
              <div className="text-purple-500 mb-4">
                <span className="material-icons text-4xl">insights</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Rapports Détaillés</h3>
              <p className="text-gray-600">
                Visualisez vos données avec des tableaux de bord intuitifs et personnalisables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Témoignages avec effet parallax */}
      <div className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Ce que nos clients disent</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 
                          transition-all duration-300">
              <p className="italic mb-4">
                "Un outil indispensable pour notre entreprise. Nous avons réduit nos coûts de stockage de 30%."
              </p>
              <p className="font-semibold">- Marie Durant, CEO</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 
                          transition-all duration-300">
              <p className="italic mb-4">
                "Les prédictions sont d'une précision remarquable. Un véritable game-changer."
              </p>
              <p className="font-semibold">- Jean Martin, Directeur Supply Chain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action final */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Prêt à optimiser votre gestion de stock ?
          </h2>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold 
                           hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 
                           shadow-lg hover:shadow-xl">
            Commencer gratuitement
          </button>
        </div>
      </div>
    </div>
  );
}