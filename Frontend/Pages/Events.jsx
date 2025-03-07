import React from "react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";

const events = [
  {
    id: 1,
    name: "Citywide Blood Donation Drive",
    date: "March 15, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Community Hall, Downtown",
    description: "Join us in saving lives! Donate blood and be a hero.",
  },
  {
    id: 2,
    name: "University Blood Camp",
    date: "March 20, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "XYZ University Campus",
    description: "A special drive for students and staff to donate blood easily.",
  },
  {
    id: 3,
    name: "Red Cross Annual Blood Donation",
    date: "March 25, 2025",
    time: "11:00 AM - 5:00 PM",
    location: "Red Cross Center, City Square",
    description: "An annual event in partnership with Red Cross. Walk-ins welcome!",
  },
];

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />
      
      {/* Framer Motion Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-20 text-center p-6 max-w-3xl w-full"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Upcoming Blood Donation Events
        </h2>
        <p className="text-lg text-gray-700 mb-10">
          Find a blood donation camp near you and make a difference!
        </p>

        {/* Event Cards */}
        <div className="space-y-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: event.id * 0.2 }}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg text-left"
            >
              <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
              <p className="text-lg text-gray-700"><strong>Date:</strong> {event.date}</p>
              <p className="text-lg text-gray-700"><strong>Time:</strong> {event.time}</p>
              <p className="text-lg text-gray-700"><strong>Location:</strong> {event.location}</p>
              <p className="text-gray-600 mt-2">{event.description}</p>
              
              {/* Register Button */}
              <button className="mt-4 bg-[#fc4848] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 transition">
                Register Now
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EventsPage;