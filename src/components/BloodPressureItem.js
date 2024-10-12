import React from 'react';
import { Link } from 'react-router-dom';

function BloodPressureItem({ reading, onDelete }) {
  // Format the date and time
  const formattedDatetime = formatDateTime(reading.datetime);

  return (
    <div>
      <p>Person: {reading.person === 'father' ? 'Father' : 'Mother'}</p>
      <p>Date and Time: {formattedDatetime}</p>
      <p>Systolic: {reading.systolic}</p>
      <p>Diastolic: {reading.diastolic}</p>
      <p>Pulse: {reading.pulse}</p>
      <Link to={`/edit/${reading.id}`}>Edit</Link>
      <button onClick={() => onDelete(reading.id)}>Delete</button>
    </div>
  );
}

function formatDateTime(datetime) {
  if (!datetime) return 'N/A';
  
  let date;
  if (datetime.toDate && typeof datetime.toDate === 'function') {
    // It's a Firestore Timestamp
    date = datetime.toDate();
  } else if (datetime instanceof Date) {
    // It's already a Date object
    date = datetime;
  } else if (typeof datetime === 'string' || typeof datetime === 'number') {
    // It's a string or number that can be parsed into a Date
    date = new Date(datetime);
  } else {
    return 'Invalid Date';
  }

  return date.toLocaleString();
}

export default BloodPressureItem;
