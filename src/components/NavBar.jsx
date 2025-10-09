import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[#0f0f23] border-b border-gray-800 py-5 px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">CP</span>
          </div>
          <span className="font-bold text-xl text-white">CodePact</span>
        </Link>

        <div className="flex space-x-8">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white font-medium transition-colors duration-200"
          >
            Features
          </Link>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white font-medium transition-colors duration-200"
          >
            About
          </a>
        </div>
      </div>
    </nav>
  );
}