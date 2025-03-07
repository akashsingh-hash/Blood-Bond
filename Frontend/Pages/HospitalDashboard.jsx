import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInventory(response.data.inventory);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Blood Inventory Management</h1>
        
        {updateStatus.message && (
          <div className={`mb-4 p-4 rounded-lg ${
            updateStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {updateStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(inventory).map(([type, quantity]) => (
            <div key={type} className="bg-white p-6 rounded-lg shadow-md">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {type.replace(/([A-Z])/g, ' $1').trim()} Blood
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setInventory({ 
                  ...inventory, 
                  [type]: parseInt(e.target.value) || 0 
                })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdateInventory}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Inventory
        </button>
      </div>
    </div>
  );
};

export default HospitalDashboard;
