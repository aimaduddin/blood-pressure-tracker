import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BloodPressureItem from './BloodPressureItem';

function BloodPressureList() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'bloodPressureReadings'));
      const fetchedReadings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReadings(fetchedReadings);
    } catch (error) {
      console.error('Error fetching readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'bloodPressureReadings', id));
      await fetchReadings();
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Blood Pressure Readings</h2>
      <div className="space-y-4">
        {readings.map(reading => (
          <BloodPressureItem 
            key={reading.id} 
            reading={reading} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
    </div>
  );
}

export default BloodPressureList;
