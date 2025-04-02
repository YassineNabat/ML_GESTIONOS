export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col items-center px-4">
        <p className="text-sm mb-2 hover:text-blue-300 transition-colors duration-300">
          &copy; {new Date().getFullYear()} Prédiction de stock. Tous droits réservés.
        </p>
        <p className="text-sm hover:text-blue-300 transition-colors duration-300">
          Réalisé par : <span className="font-semibold text-blue-400">BARKOUCH Yassine</span> et{" "}
          <span className="font-semibold text-blue-400">NABAT Yassine</span>
        </p>
      </div>
    </footer>
  );
}