import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, HeartPulse } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#0b004e] via-[#1d152f] to-[#002834] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-white text-2xl font-bold"
        >
          <HeartPulse className="mr-2 text-[#fb4673]" />
          <span className="text-[#28bca9]">BloodBond</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gradient-to-r from-[#0b004e] via-[#1d152f] to-[#002834] text-white flex flex-col items-center space-y-4 py-4"
        >
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
        </motion.div>
      )}
    </nav>
  );
};

// Reusable Navigation Item Component
const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-white hover:text-[#28bca9] transition duration-300 text-lg"
  >
    {label}
  </Link>
);

export default Navbar;
