import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BloodPressureItem from './BloodPressureItem';
import * as XLSX from 'xlsx';

function BloodPressureList() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    if (filter !== 'all' && reading.person !== filter) return false;
    
    const readingDate = new Date(reading.datetime);
    if (startDate && new Date(startDate) > readingDate) return false;
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999); // Set to end of day
      if (endDateTime < readingDate) return false;
    }
    
    return true;
  });

  const exportToExcel = () => {
    const dataToExport = filteredReadings.map(reading => {
      const date = reading.datetime && typeof reading.datetime.toDate === 'function'
        ? reading.datetime.toDate()
        : new Date(reading.datetime);
      return {
        Date: date.toLocaleDateString(),
        Time: date.toLocaleTimeString(),
        'Time of Day': reading.timeOfDay,
        'BP Reading': `${reading.systolic}/${reading.diastolic}`,
        Pulse: reading.pulse,
        Remarks: reading.remarks || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Blood Pressure Readings");

    let filename = `blood_pressure_readings_${filter}`;
    if (startDate) filename += `_from_${startDate}`;
    if (endDate) filename += `_to_${endDate}`;
    filename += '.xlsx';

    XLSX.writeFile(wb, filename);
  };

  const resetDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Blood Pressure Readings</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-auto"
            placeholder="End Date"
          />
          <button 
            onClick={resetDateFilter}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
          >
            Reset Dates
          </button>
          <button 
            onClick={exportToExcel}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Export to Excel
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
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
