import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BloodPressureItem from './BloodPressureItem';
import * as XLSX from 'xlsx';

function BloodPressureList() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'mother', or 'father'

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

  const filteredReadings = readings.filter(reading => {
    if (filter === 'all') return true;
    return reading.person === filter;
  });

  const exportToExcel = () => {
    const dataToExport = filteredReadings.map(reading => {
      const date = new Date(reading.datetime);
      return {
        Date: date.toLocaleDateString(),
        Time: date.toLocaleTimeString(),
        'Time of Day': reading.timeOfDay,
        'BP Reading': `${reading.systolic}/${reading.diastolic}`,
        Pulse: reading.pulse
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Blood Pressure Readings");

    // Generate filename based on current filter
    const filename = `blood_pressure_readings_${filter}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Blood Pressure Readings</h2>
        <button 
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Export to Excel
        </button>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('mother')} 
          className={`px-4 py-2 rounded ${filter === 'mother' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Mother
        </button>
        <button 
          onClick={() => setFilter('father')} 
          className={`px-4 py-2 rounded ${filter === 'father' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Father
        </button>
      </div>
      
      <div className="space-y-4">
        {filteredReadings.map(reading => (
          <BloodPressureItem 
            key={reading.id} 
            reading={reading} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
      
      {filteredReadings.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No readings found for the selected filter.</p>
      )}
    </div>
  );
}

export default BloodPressureList;
