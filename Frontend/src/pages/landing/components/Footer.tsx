import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon, Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full text-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="w-32 mb-4" />
            </Link>
            <p className="text-sm text-gray-300">
              At Medix Software, we create custom solutions for small and
              mid-sized enterprises, and render business automation services,
              using time-proven technologies and approaches.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#fbae3b]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#fbae3b]">
                  About
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#fbae3b]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#fbae3b]">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faqs" className="hover:text-[#fbae3b]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/quick-start" className="hover:text-[#fbae3b]">
                  Quick Start
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="hover:text-[#fbae3b]">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/user-guide" className="hover:text-[#fbae3b]">
                  User Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-bold">Nepal:</span> Patan Dhoka
            </p>

            <p className="text-sm text-gray-300 mb-4">
              <span className="font-bold">Phone:</span> +977 98084299949
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-bold">Email:</span>{" "}
              contact@medixsoftware.com
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-white hover:text-[#fbae3b] text-xl">
              <FacebookIcon />
            </span>
          </a>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-white hover:text-[#fbae3b] text-xl">
              <Twitter />
            </span>
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Medix Software. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
