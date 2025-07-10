import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaArrowUp,
} from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#1a1a1a] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* About */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Adhirath</h3>
          <p className="text-gray-300">
            Empowering children with Autism and ID using AI-based interactive learning tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <button onClick={() => scrollToSection('home')} className="block text-gray-300 hover:text-green-400 mb-1">
            Home
          </button>
          <button onClick={() => scrollToSection('LearningModules')} className="block text-gray-300 hover:text-green-400 mb-1">
            Modules
          </button>
          <button onClick={() => scrollToSection('features')} className="block text-gray-300 hover:text-green-400 mb-1">
            Features
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="block text-gray-300 hover:text-green-400 mb-1">
            Testimonials
          </button>
          <button onClick={() => scrollToSection('faq')} className="block text-gray-300 hover:text-green-400 mb-1">
            FAQ
          </button>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <p className="text-gray-300">Email: info@adhirath.com</p>
          <p className="text-gray-300">Phone: (555) 123-4567</p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 text-xl"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 text-xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center border-t border-gray-700 pt-6 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Adhirath Project. All rights reserved.</p>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition duration-300"
        aria-label="Back to Top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
