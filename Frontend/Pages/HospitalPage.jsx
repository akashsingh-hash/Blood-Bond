import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const dummyReviews = [
  {
    userName: "John Doe",
    rating: 5,
    comment: "Excellent service and very professional staff!",
    date: "2024-03-15"
  },
  {
    userName: "Jane Smith",
    rating: 4,
    comment: "Good experience overall. Quick and efficient.",
    date: "2024-03-10"
  },
  {
    userName: "Mike Johnson",
    rating: 5,
    comment: "Very clean facility and helpful staff.",
    date: "2024-03-05"
  }
];

const HospitalPage = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hospitals/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if required
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hospital data received:", data); // Debug log
        setHospital(data);
      } catch (err) {
        console.error("Error fetching hospital data:", err);
        setError("Failed to load hospital data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hospital Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{hospital?.hospitalName}</h1>
          <p className="text-gray-600 mb-4">{hospital?.location}</p>
          
          {/* Blood Inventory */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Blood Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hospital?.inventory && Object.entries(hospital.inventory).map(([type, quantity]) => (
              <div key={type} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-medium text-gray-900">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-2xl font-bold text-blue-600">{quantity} units</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="space-y-6">
            {dummyReviews.map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">{review.userName}</span>
                  <span className="ml-2 text-gray-500">• {review.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalPage;
