import React from 'react';
import { Link } from 'react-router-dom';

function BloodPressureItem({ reading, onDelete }) {
  const formattedDatetime = reading.datetime && typeof reading.datetime.toDate === 'function'
    ? reading.datetime.toDate().toLocaleString()
    : new Date(reading.datetime).toLocaleString();

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <p><span className="font-semibold">Person:</span> {reading.person === 'father' ? 'Father' : 'Mother'}</p>
        <p><span className="font-semibold">Date and Time:</span> {formattedDatetime}</p>
        <p><span className="font-semibold">Time of Day:</span> {reading.timeOfDay}</p>
        <p><span className="font-semibold">Systolic:</span> {reading.systolic}</p>
        <p><span className="font-semibold">Diastolic:</span> {reading.diastolic}</p>
        <p><span className="font-semibold">Pulse:</span> {reading.pulse}</p>
        {reading.remarks && (
          <p className="col-span-1 sm:col-span-2"><span className="font-semibold">Remarks:</span> {reading.remarks}</p>
        )}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Link to={`/edit/${reading.id}`} className="w-full sm:w-auto text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Edit</Link>
        <button onClick={() => onDelete(reading.id)} className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">Delete</button>
      </div>
    </div>
  );
}

export default BloodPressureItem;
