import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Chatbot from "../Components/ChatBot";

const UserDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ user: true, hospitals: true });
  const [errors, setErrors] = useState({ user: null, hospitals: null });
  const [showAllHospitals, setShowAllHospitals] = useState(false);

  useEffect(() => {
    // Show welcome toast
    toast.success("Successfully logged in!", {
      duration: 3000,
      position: "top-right",
    });

    const fetchUserData = async () => {
      try {
        // Get token from localStorage if you're using token-based auth
        const token = localStorage.getItem("token");
        const userResponse = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (userResponse.status === 500) {
          throw new Error("Server error - Please try again later");
        }
        if (userResponse.status === 401) {
          throw new Error("Please login to continue");
        }
        if (!userResponse.ok) {
          throw new Error(`Request failed with status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser(userData);
        setErrors((prev) => ({ ...prev, user: null }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, user: err.message }));
        console.error("User data fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };

    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/hospitals", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch hospitals: ${response.status}`);
        }
        const data = await response.json();
        setHospitals(Array.isArray(data) ? data : []);
        setErrors((prev) => ({ ...prev, hospitals: null }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, hospitals: err.message }));
        console.error("Hospitals fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, hospitals: false }));
      }
    };

    fetchUserData();
    fetchHospitals();
  }, []);

  // Add this function to filter hospitals
  const filteredHospitals = () => {
    if (showAllHospitals) return hospitals;
    return hospitals.filter(
      (hospital) =>
        hospital.location?.city?.toLowerCase() ===
        user?.location?.city?.toLowerCase()
    );
  };

  if (loading.user && loading.hospitals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e6f3ff] to-[#f0f9ff] pt-20 p-6">
      {errors.user && (
        <div className="text-center mx-auto max-w-2xl mt-4 mb-4 text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">
          {errors.user}
        </div>
      )}

      {user && (
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#1e3a8a] bg-clip-text">
            Welcome, {user.name}!
          </h2>
          <div className="flex justify-center gap-8">
            <div className="px-6 py-3 bg-white rounded-lg shadow-md border border-[#e5e7eb]">
              <p className="text-[#1e3a8a]">
                Blood Group:{" "}
                <span className="font-semibold">{user.bloodGroup}</span>
              </p>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow-md border border-[#e5e7eb]">
              <p className="text-[#1e3a8a]">
                Location:
                <span className="font-semibold">
                  {user?.location?.city}, {user?.location?.state}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-[#1e3a8a]">
          {showAllHospitals ? "All Hospitals" : "Nearby Hospitals"}
        </h1>
        <button
          onClick={() => setShowAllHospitals(!showAllHospitals)}
          className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#2d4ba0] transition-colors"
        >
          {showAllHospitals ? "Show Nearby Hospitals" : "Show All Hospitals"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredHospitals().length === 0 ? (
          <p className="text-center text-xl font-bold text-gray-600 col-span-full">
            {showAllHospitals
              ? "No hospitals available"
              : "No hospitals available in your city"}
          </p>
        ) : (
          filteredHospitals().map((hospital) => (
            <HospitalCard
              key={hospital._id}
              hospital={hospital}
              userLocation={user?.location}
            />
          ))
        )}
      </div>

      {/* Add Chatbot component */}
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

const coordinatesCache = new Map();

const getCoordinates = async (city, state) => {
  const locationKey = `${city},${state}`;
  if (coordinatesCache.has(locationKey)) {
    return coordinatesCache.get(locationKey);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        city
      )}&state=${encodeURIComponent(state)}&country=india&format=json&limit=1`
    );
    const data = await response.json();

    if (data && data[0]) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      coordinatesCache.set(locationKey, coords);
      return coords;
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const calculateDistance = async (location1, location2) => {
  try {
    if (!location1?.city || !location2?.city) return "N/A";

    const coords1 = await getCoordinates(location1.city, location1.state);
    const coords2 = await getCoordinates(location2.city, location2.state);

    if (!coords1 || !coords2) return "N/A";

    const R = 6371;
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
  } catch (error) {
    console.error("Error calculating distance:", error);
    return "N/A";
  }
};

const HospitalCard = ({ hospital, userLocation }) => {
  const [distance, setDistance] = useState("...");

  useEffect(() => {
    calculateDistance(userLocation, hospital.location).then((dist) =>
      setDistance(dist)
    );
  }, [hospital.location, userLocation]);

  return (
    <Link to={`/hospital/${hospital._id}`}>
      <div
        className="bg-white p-6 rounded-xl border border-[#e5e7eb] 
                     shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(29,78,216,0.15)] 
                     transition-all duration-300 hover:translate-y-[-5px] relative overflow-hidden"
      >
        {/* Replace the background icon with medical plus sign */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <svg viewBox="0 0 24 24" fill="#1e3a8a" className="w-full h-full">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {hospital.hospitalName}
        </h2>

        <div className="space-y-3">
          <p className="text-gray-600 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#1e3a8a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {hospital.location?.city}, {hospital.location?.state}
          </p>

          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5 text-[#1e3a8a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {hospital.email}
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5 text-[#1e3a8a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Reg. No: {hospital.registrationNumber}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-[#1e3a8a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Distance: {distance === "N/A" ? "Unknown" : `${distance} km`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserDashboard;
