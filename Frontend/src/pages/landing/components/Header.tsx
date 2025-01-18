import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header className="sticky bg-gradient-to-b from-black to-[rgba(0,0,0,0.7)] backdrop-blur shadow-md w-full z-50 top-0">
      <div className="mx-auto px-4 max-w-7xl py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          <img src="/logo.png" alt="logo" className="w-32 aspect-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden text-white md:flex items-center space-x-6">
          <Link to="/" className="hover:text-[#fbae3b]">
            Home
          </Link>
          <Link to="/about" className="hover:text-[#fbae3b]">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#fbae3b]">
            Contact
          </Link>
        </nav>

        {/* Call-to-Action Button */}
        <div className="hidden md:flex items-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full bg-transparent border-[#fbae3b] hover:bg-[#fbae3b]"
          >
            <Link to="/login" className="text-[#fbae3b]">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-white focus:outline-none">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent className="p-4 bg-white w-[80%]">
            <SheetHeader>
              <Link to="/" className="text-xl font-bold text-gray-800">
                <img src="/logo.png" alt="logo" className="w-24 aspect-auto" />
              </Link>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-6">
              <Link to="/" className="text-gray-800 hover:text-blue-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-800 hover:text-blue-600">
                About
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-blue-600">
                Contact
              </Link>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#fbae3b] hover:bg-[#fbae3b]"
              >
                <Link to="/login" className="text-[#fbae3b]">
                  Get Started
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
