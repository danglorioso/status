import React from "react";
// import SocialIcons from "./SocialIcons3";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t border-gray-800 z-50 mt-10">
      <div className="max-w-5xl mx-auto px-8">
        
        {/* MOBILE - Stack with social icons on top */}
        <div className="sm:hidden flex flex-col space-y-2">
          {/* Mobile Social Icons at top */}
          <div className="flex space-x-5">
                {/* LinkedIn */}
                <a
                href="/linkedin"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="LinkedIn"
                >
                <FaLinkedin className="w-7 h-7" />
                </a>
                {/* Github */}
                <a
                href="/github"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="GitHub"
                >
                <FaGithub className="w-7 h-7" />
                </a>
                {/* Email */}
                {/* <a
                href="/mail"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="Email"
                >
                <FaEnvelope className="w-7 h-7" />
                </a> */}
            </div>

          {/* Copyright */}
          <p className="text-md text-gray-300 text-center">
            Copyright © {new Date().getFullYear()}. Created by{" "}
            <a
              href="https://danglorioso.com"
              target="" // Open in same tab
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-300 transition-all duration-300 ease-in-out"
            >
              Dan Glorioso
            </a>
            .
          </p>
          
          {/* Status Links */}
          <div className="flex justify-center">
            <p className="text-sm text-gray-500 flex items-center">
              <a
                href="/contact"
                target="" // Open in same tab
                className="text-gray-400 hover:text-gray-300 transition-colors duration-300 ease-in-out"
              >
                Contact
              </a>
            </p>
          </div>
        </div>

        {/* DESKTOP - Text left, icons right */}
        <div className="hidden sm:block">
          {/* Top row: Copyright left, Social icons right */}
          <div className="flex justify-between items-center">
            <p className="text-md text-gray-300">
              Copyright © {new Date().getFullYear()}. Created by{" "}
              <a
                href="/"
                target="" // Open in same tab
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-300 transition-all duration-300 ease-in-out"
              >
                Dan Glorioso
              </a>
              .
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-5">
                {/* LinkedIn */}
                <a
                href="/linkedin"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="LinkedIn"
                >
                <FaLinkedin className="w-7 h-7" />
                </a>
                {/* Github */}
                <a
                href="/github"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="GitHub"
                >
                <FaGithub className="w-7 h-7" />
                </a>
                {/* Email */}
                {/* <a
                href="/mail"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-105 transition-colors duration-300 ease-in-out"
                aria-label="Email"
                >
                <FaEnvelope className="w-7 h-7" />
                </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
