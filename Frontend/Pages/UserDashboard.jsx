import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('/api/hospitals');
        setHospitals(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r pt-20 from-[#fb4673] via-[#28bca9] to-[#99cccc] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">User Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.length === 0 ? (
          <p className="text-center text-xl font-bold">No hospital present</p>
        ) : (
          hospitals.map((hospital) => (
            <div key={hospital._id} className="bg-[#223634] p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">{hospital.hospitalName}</h2>
              <p className="mt-2">Location: {hospital.location}</p>
              <p className="mt-2">Blood Inventory: {hospital.inventory.blood}</p>
              <p className="mt-2">Organ Inventory: {hospital.inventory.organs}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
