import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { FaHospital, FaMapMarkerAlt, FaTint, FaSync } from 'react-icons/fa';

const HospitalDashboard = () => {
  const [inventory, setInventory] = useState({
    aPositive: 0,
    aNegative: 0,
    bPositive: 0,
    bNegative: 0,
    abPositive: 0,
    abNegative: 0,
    oPositive: 0,
    oNegative: 0
  });
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState({ message: '', error: false });
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    toast.success('Hospital logged in successfully!', {
      duration: 3000,
      position: 'top-right',
    });

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Hospital Data:', response.data); // Add this debug line
      setInventory(response.data.inventory || {});
      setHospital(response.data || null);
      setLoading(false);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setLoading(false);
    }
  };

  const handleUpdateInventory = async () => {
    try {
      setUpdateStatus({ message: 'Updating...', error: false });
      
      const response = await axios.put(
        'http://localhost:5000/api/hospitals/inventory',
        inventory,
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.inventory) {
        setInventory(response.data.inventory);
      }
      
      setUpdateStatus({ message: 'Inventory updated successfully!', error: false });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus({ message: '', error: false });
      }, 3000);

    } catch (err) {
      console.error('Update error:', err);
      setUpdateStatus({ 
        message: err.response?.data?.message || 'Failed to update inventory', 
        error: true 
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-6 pb-6"> {/* Added pt-20 for navbar */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaHospital className="text-3xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              {hospital?.hospitalName || 'Hospital Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center text-gray-700 mb-4">
            <FaMapMarkerAlt className="text-xl text-blue-600 mr-2" />
            <p className="text-lg">
              {hospital?.location?.city || 'City'}, {hospital?.location?.state || 'State'}
            </p>
          </div>
        </div>

        {updateStatus.message && (
          <div className={`mb-4 p-4 rounded-lg ${
            updateStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {updateStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(inventory).map(([type, quantity]) => (
            <div key={type} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaTint className="text-red-500 mr-3 text-xl" />
                  <label className="block text-lg font-semibold text-gray-700">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Units: {quantity}
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setInventory({ 
                  ...inventory, 
                  [type]: parseInt(e.target.value) || 0 
                })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdateInventory}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaSync className={updateStatus.message === 'Updating...' ? 'animate-spin' : ''} />
          Update Inventory
        </button>
      </div>
    </div>
  );
};

export default HospitalDashboard;
