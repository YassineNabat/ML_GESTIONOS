





export default function Footer() {
  return (<>
      <footer className="bg-stone-700 text-white py-4 mt-6">
        <div className="container mx-auto flex flex-col items-center px-[15%] text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Prédiction de stock. Tous droits réservés.</p>
          <p className="text-sm mt-2">Réalisé par : <span className="font-semibold">BARKOUCH Yassine</span> et <span className="font-semibold">NABAT Yassine</span></p>
        </div>
      </footer>
    </>
  );
}