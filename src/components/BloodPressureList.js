import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BloodPressureItem from './BloodPressureItem';
import Pagination from './Pagination';
import * as XLSX from 'xlsx';

function BloodPressureList() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [readingsPerPage] = useState(10);

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

      // Sort readings by datetime from latest to oldest
      fetchedReadings.sort((a, b) => {
        const dateA = a.datetime && typeof a.datetime.toDate === 'function' ? a.datetime.toDate() : new Date(a.datetime);
        const dateB = b.datetime && typeof b.datetime.toDate === 'function' ? b.datetime.toDate() : new Date(b.datetime);
        return dateB - dateA; // Sort in descending order
      });

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

  // Get current readings
  const indexOfLastReading = currentPage * readingsPerPage;
  const indexOfFirstReading = indexOfLastReading - readingsPerPage;
  const currentReadings = filteredReadings.slice(indexOfFirstReading, indexOfLastReading);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="w-full sm:w-auto">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <button 
          onClick={resetDateFilter}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
        >
          Reset Dates
        </button>
        <button 
          onClick={exportToExcel}
          className="hidden sm:block w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Export to Excel
        </button>
      </div>
      
      <div className="space-y-4 mt-4">
        {currentReadings.map(reading => (
          <BloodPressureItem 
            key={reading.id} 
            reading={reading} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
      
      {filteredReadings.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No readings found for the selected filter.</p>
      ) : (
        <div className="mt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(filteredReadings.length / readingsPerPage)}
            onPageChange={paginate}
          />
        </div>
      )}
    </div>
  );
}

export default BloodPressureList;
