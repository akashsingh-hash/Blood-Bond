import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../Components/ChatBot";

const UserDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ user: true, hospitals: true });
  const [errors, setErrors] = useState({ user: null, hospitals: null });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage if you're using token-based auth
        const token = localStorage.getItem('token');
        const userResponse = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (userResponse.status === 500) {
          throw new Error('Server error - Please try again later');
        }
        if (userResponse.status === 401) {
          throw new Error('Please login to continue');
        }
        if (!userResponse.ok) {
          throw new Error(`Request failed with status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser(userData);
        setErrors(prev => ({ ...prev, user: null }));
      } catch (err) {
        setErrors(prev => ({ ...prev, user: err.message }));
        console.error('User data fetch error:', err);
      } finally {
        setLoading(prev => ({ ...prev, user: false }));
      }
    };

    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/hospitals', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hospitals: ${response.status}`);
        }
        const data = await response.json();
        setHospitals(Array.isArray(data) ? data : []);
        setErrors(prev => ({ ...prev, hospitals: null }));
      } catch (err) {
        setErrors(prev => ({ ...prev, hospitals: err.message }));
        console.error('Hospitals fetch error:', err);
      } finally {
        setLoading(prev => ({ ...prev, hospitals: false }));
      }
    };

    fetchUserData();
    fetchHospitals();
  }, []);

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
          <h2 className="text-4xl font-bold mb-6 text-[#1e3a8a] bg-clip-text">Welcome, {user.name}!</h2>
          <div className="flex justify-center gap-8">
            <div className="px-6 py-3 bg-white rounded-lg shadow-md border border-[#e5e7eb]">
              <p className="text-[#1e3a8a]">Blood Group: <span className="font-semibold">{user.bloodGroup}</span></p>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow-md border border-[#e5e7eb]">
              <p className="text-[#1e3a8a]">Location: <span className="font-semibold">{user.location}</span></p>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-center mb-10 text-[#1e3a8a]">Available Hospitals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {hospitals.length === 0 ? (
          <p className="text-center text-xl font-bold text-gray-600 col-span-full">No hospitals available</p>
        ) : (
          hospitals.map((hospital) => (
            <Link to={`/hospital/${hospital._id}`} key={hospital._id}>
              <div 
                className="bg-white p-6 rounded-xl border border-[#e5e7eb] 
                           shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(29,78,216,0.15)] 
                           transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <svg viewBox="0 0 24 24" fill="#1e3a8a" className="w-full h-full">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">{hospital.hospitalName}</h2>
                <div className="space-y-3">
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {hospital.location}
                  </p>
                  <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Blood Units:</span>
                    <span className="font-semibold text-[#1e3a8a]">{hospital.inventory.blood}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Organs Available:</span>
                    <span className="font-semibold text-[#1e3a8a]">{hospital.inventory.organs}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    Distance: {calculateDistance(user?.location, hospital.location)} km
                  </div>
                </div>
              </div>
            </Link>
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

// Helper function to calculate distance using the Haversine formula
const calculateDistance = (userLocation, hospitalLocation) => {
  if (!userLocation || !hospitalLocation) return "N/A";

  // Convert string coordinates to numbers
  // Expecting format: "latitude,longitude"
  const [userLat, userLng] = userLocation.split(',').map(coord => parseFloat(coord.trim()));
  const [hospitalLat, hospitalLng] = hospitalLocation.split(',').map(coord => parseFloat(coord.trim()));

  // Check if coordinates are valid numbers
  if (isNaN(userLat) || isNaN(userLng) || isNaN(hospitalLat) || isNaN(hospitalLng)) {
    return "N/A";
  }

  // Haversine formula
  const R = 6371; // Earth's radius in kilometers
  const dLat = (hospitalLat - userLat) * Math.PI / 180;
  const dLon = (hospitalLng - userLng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(hospitalLat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance.toFixed(1);
};

export default UserDashboard;
