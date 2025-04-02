export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-stone-800 text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Bienvenue dans votre tableau de bord</h2>
        <p className="text-lg">Gérez vos stocks, consultez vos données et collaborez avec votre équipe.</p>
        {/* Ajoutez ici d'autres sections ou composants spécifiques au tableau de bord */}
      </main>
    </div>
  );
}
