import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import UserDashboard from "../Pages/UserDashboard";
import HospitalDashboard from "../Pages/HospitalDashboard";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
