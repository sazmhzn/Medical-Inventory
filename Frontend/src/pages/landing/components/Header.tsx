import { Button } from "@/components/ui/button";
import useToggle from "@/hooks/useToggle";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, toggleMenu] = useToggle(false); // For the mobile menu
  const [dropdownOpen, toggleDropdown] = useToggle(false); // For the dropdown menu

  return (
    <header className="sticky bg-gradient-to-b from-black to-[rgba(0,0,0,0.7)] backdrop-blur shadow-md w-full z-50 top-0">
      <div className=" mx-auto px-4 md:px-0 max-w-7xl py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          MySite
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden text-white md:flex items-center space-x-6 relative">
          <Link to="/" className=" hover:text-[#fbae3b]">
            Home
          </Link>
          <Link to="/about" className=" hover:text-[#fbae3b]">
            About
          </Link>

          {/* Dropdown Link */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center  hover:text-[#fbae3b] focus:outline-none"
            >
              Services
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 bg-white shadow-lg rounded-md w-48">
                <ul>
                  <li>
                    <Link
                      to="/services/web-development"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Web Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/mobile-development"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Mobile Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/seo"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      SEO Optimization
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Link to="/contact" className=" hover:text-[#fbae3b]">
            Contact
          </Link>
        </nav>

        {/* Call-to-Action Button */}
        <div className="hidden md:flex md:items-center md:gap-2 ">
          <Search className="stroke-white" />
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#fbae3b] hover:bg-[#fbae3b]"
          >
            <Link
              to="/login"
              className=" text-[#fbae3b] bg-transparent border-2  justify-center items-center inline-flex"
            >
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" className="text-gray-800 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-blue-600">
              About
            </Link>

            {/* Dropdown in Mobile */}
            <div className="relative w-full">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Services
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="bg-white shadow-lg rounded-md">
                  <ul>
                    <li>
                      <Link
                        to="/services/web-development"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Web Development
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/mobile-development"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Mobile Development
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/seo"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        SEO Optimization
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
