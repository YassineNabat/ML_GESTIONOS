import { Link } from "react-router-dom";
import logo from "../images/logo.png";




export default function Header() {
  return (
  <>

<nav className="bg-stone-700 border-b shadow py-3 mb-3">
  <div className="container mx-auto flex items-center justify-between px-[15%]">
    <Link className="text-lg font-semibold" to="/"><img className="h-12 w-auto" src={logo} alt=""/></Link>
    
    <div className="lg:flex items-center space-x-6">
      <ul className="flex space-x-8">
        <li className="font-bold text-center hover:text-gray-200">
          <Link className="" to="/train">
            train
          </Link>
        </li>
        <li className="font-bold text-center hover:text-gray-200">
          <Link className="" to="/predict">
            predict
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
      
  </>
  );
}