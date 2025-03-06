import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Search, LogIn, UserPlus, AlertCircle } from "lucide-react";
import heroImage from "../assets/hero-image.png"; // Replace with actual image

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#fb4673] via-[#28bca9] to-[#99cccc] text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between min-h-[90vh]">
        
        {/* Left Content */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Donate Blood, <span className="text-[#223634]">Save Lives</span>
          </h1>
          <p className="mt-4 text-lg text-[#223634]">
            Every drop counts! Help those in need by donating blood or organs. Find donors nearby and make a difference today.
          </p>

          

          {/* Login & Signup Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="flex items-center bg-white text-[#28bca9] px-6 py-3 rounded-lg font-semibold hover:bg-[#223634] transition"
            >
              <LogIn className="mr-2" /> Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center border-2 border-white px-6 py-3 rounded-lg text-white hover:bg-white hover:text-[#28bca9] transition"
            >
              <UserPlus className="mr-2" /> Sign Up
            </Link>
          </div>

          {/* Emergency Alert */}
          <div className="mt-6 flex items-center text-[#223634]">
            <AlertCircle className="mr-2" />
            <p>Urgent blood needed? Request emergency donations now!</p>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={heroImage}
            alt="Blood Donation"
            className="w-[90%] md:w-[80%] rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
