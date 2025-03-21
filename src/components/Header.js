import { Link } from "react-router-dom";
import logo from "../images/logo.png";




export default function Header() {
  return (
  <>

<nav className="bg-stone-700 border-b shadow py-1 mb-3">
  <div className="container mx-auto flex items-center justify-between max-w-4xl">
    <Link className="text-lg font-semibold" to="/"><img className="h-16 w-auto" src={logo} alt=""/></Link>
    
    <div className="lg:flex items-center space-x-6">
      <ul className="flex space-x-8">
        <li className="font-bold text-center hover:text-gray-200">
          <Link className="" to="/train">
            Train
          </Link>
        </li>
        <li className="font-bold text-center hover:text-gray-200">
          <Link className="" to="/predict">
            Predict
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
      
  </>
  );
}