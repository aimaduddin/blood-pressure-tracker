import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function BloodPressureForm() {
  const [person, setPerson] = useState('father');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [datetime, setDatetime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchReading();
    } else {
      setDefaultDatetime();
    }
  }, [id]);

  const setDefaultDatetime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDatetime(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  const fetchReading = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'bloodPressureReadings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPerson(data.person);
        setSystolic(data.systolic);
        setDiastolic(data.diastolic);
        setPulse(data.pulse);
        setDatetime(new Date(data.datetime).toISOString().slice(0, 16));
      }
    } catch (error) {
      console.error('Error fetching reading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const reading = { 
      person, 
      systolic: Number(systolic), 
      diastolic: Number(diastolic), 
      pulse: Number(pulse), 
      datetime: new Date(datetime).toISOString()
    };
    
    try {
      if (id) {
        const docRef = doc(db, 'bloodPressureReadings', id);
        await updateDoc(docRef, reading);
      } else {
        await addDoc(collection(db, 'bloodPressureReadings'), reading);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving reading:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{id ? 'Edit' : 'Add'} Blood Pressure Reading</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="person" className="block text-sm font-medium text-gray-700">Person</label>
          <select
            id="person"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            required
          >
            <option value="father">Father</option>
            <option value="mother">Mother</option>
          </select>
        </div>
        <div>
          <label htmlFor="systolic" className="block text-sm font-medium text-gray-700">Systolic</label>
          <input
            type="number"
            id="systolic"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700">Diastolic</label>
          <input
            type="number"
            id="diastolic"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="pulse" className="block text-sm font-medium text-gray-700">Pulse</label>
          <input
            type="number"
            id="pulse"
            value={pulse}
            onChange={(e) => setPulse(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">Date and Time</label>
          <input
            type="datetime-local"
            id="datetime"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            {id ? 'Update' : 'Add'} Reading
          </button>
        </div>
      </form>
    </div>
  );
}

export default BloodPressureForm;