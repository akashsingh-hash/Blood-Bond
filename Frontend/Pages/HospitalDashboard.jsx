import React, { useEffect, useState } from "react";
import axios from "axios";

const HospitalDashboard = () => {
  const [inventory, setInventory] = useState({ blood: 0, organs: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/hospitals/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setInventory(response.data.inventory || { blood: 0, organs: 0 });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateInventory = async () => {
    try {
      await axios.put('/api/hospitals/inventory', inventory, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Inventory updated successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fb4673] via-[#28bca9] to-[#99cccc] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Hospital Dashboard</h1>
      <div className="max-w-md mx-auto bg-[#223634] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Inventory</h2>
        <div className="mb-4">
          <label className="block text-lg">Blood Inventory</label>
          <input
            type="number"
            value={inventory.blood}
            onChange={(e) => setInventory({ ...inventory, blood: e.target.value })}
            className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Organ Inventory</label>
          <input
            type="number"
            value={inventory.organs}
            onChange={(e) => setInventory({ ...inventory, organs: e.target.value })}
            className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
          />
        </div>
        <button
          onClick={handleUpdateInventory}
          className="w-full bg-[#fb4673] hover:bg-[#28bca9] py-3 rounded-lg text-lg font-semibold transition"
        >
          Update Inventory
        </button>
      </div>
    </div>
  );
};

export default HospitalDashboard;
