export default function Home() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-cover bg-center text-white py-20" style={{ backgroundImage: "url('/path-to-your-hero-image.jpg')" }}>
          <div className="max-w-4xl mx-auto text-center bg-stone-800 bg-opacity-90 p-8 rounded-lg">
            <h1 className="text-5xl font-bold mb-6">Bienvenue sur notre plateforme</h1>
            <p className="text-xl mb-6">Simplifiez la gestion de vos stocks avec des outils modernes et intuitifs.</p>
            <button className="bg-stone-700 text-white px-6 py-3 rounded-lg hover:bg-stone-800">
              Commencer maintenant
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto mt-12 px-4">
          <h2 className="text-2xl font-semibold text-center mb-8">Nos fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 mr-2">analytics</span>
                Analyse des données
              </h3>
              <p>Obtenez des insights détaillés sur vos stocks en temps réel.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 mr-2">insights</span>
                Prédictions précises
              </h3>
              <p>Anticipez vos besoins en stock grâce à nos algorithmes avancés.</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 mr-2">group</span>
                Collaboration facile
              </h3>
              <p>Travaillez en équipe pour une gestion optimale de vos ressources.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-200 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-8">Ce que disent nos utilisateurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-md p-6 rounded-lg">
                <p className="italic">"Cette application a transformé notre façon de gérer les stocks. Simple et efficace !"</p>
                <p className="mt-4 font-bold">- Jean Dupont</p>
              </div>
              <div className="bg-white shadow-md p-6 rounded-lg">
                <p className="italic">"Les prédictions sont incroyablement précises. Nous avons réduit nos coûts de stockage de 20%."</p>
                <p className="mt-4 font-bold">- Marie Curie</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-stone-800 bg-opacity-90 text-white py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à améliorer votre gestion de stock ?</h2>
            <p className="text-lg mb-6">Rejoignez-nous dès aujourd'hui et découvrez comment nous pouvons vous aider.</p>
            <button className="bg-stone-700 text-white px-6 py-3 rounded-lg hover:bg-stone-800">
              Créer un compte
            </button>
          </div>
        </section>
      </div>
    </>
  );
}