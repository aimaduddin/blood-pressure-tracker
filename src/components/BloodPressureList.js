import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BloodPressureItem from './BloodPressureItem';
import Spinner from './Spinner';

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
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'bloodPressureReadings', id));
      await fetchReadings();
    } catch (error) {
      console.error('Error deleting reading:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2>Blood Pressure Readings</h2>
      {readings.map(reading => (
        <BloodPressureItem 
          key={reading.id} 
          reading={reading} 
          onDelete={handleDelete} 
        />
      ))}
    </div>
  );
}

export default BloodPressureList;
