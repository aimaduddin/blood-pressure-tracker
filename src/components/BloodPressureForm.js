import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from './Spinner';

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
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit' : 'Add'} Blood Pressure Reading</h2>
      <div>
        <label htmlFor="person">Person:</label>
        <select
          id="person"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          required
        >
          <option value="father">Father</option>
          <option value="mother">Mother</option>
        </select>
      </div>
      <div>
        <label htmlFor="systolic">Systolic:</label>
        <input
          type="number"
          id="systolic"
          value={systolic}
          onChange={(e) => setSystolic(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="diastolic">Diastolic:</label>
        <input
          type="number"
          id="diastolic"
          value={diastolic}
          onChange={(e) => setDiastolic(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="pulse">Pulse:</label>
        <input
          type="number"
          id="pulse"
          value={pulse}
          onChange={(e) => setPulse(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="datetime">Date and Time:</label>
        <input
          type="datetime-local"
          id="datetime"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
      </div>
      <button type="submit">{id ? 'Update' : 'Add'} Reading</button>
    </form>
  );
}

export default BloodPressureForm;
