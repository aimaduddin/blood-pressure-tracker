import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function BloodPressureChart({ readings, person }) {
  const [visibleTimeOfDay, setVisibleTimeOfDay] = useState({
    morning: true,
    noon: true,
    afternoon: true,
    night: true
  });

  const getTimeOfDayColor = (timeOfDay) => {
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return 'rgb(255, 206, 86)'; // yellow
      case 'noon': return 'rgb(255, 159, 64)'; // orange
      case 'afternoon': return 'rgb(75, 192, 192)'; // teal
      case 'night': return 'rgb(153, 102, 255)'; // purple
      default: return 'rgb(201, 203, 207)'; // grey
    }
  };

  const getTimeOfDaySymbol = (timeOfDay) => {
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return '🌅';
      case 'noon': return '☀️';
      case 'afternoon': return '🌤️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const sortedReadings = readings.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const filteredReadings = sortedReadings.filter(reading => visibleTimeOfDay[reading.timeOfDay.toLowerCase()]);

  const statistics = useMemo(() => {
    if (filteredReadings.length === 0) return { highest: { systolic: 0, diastolic: 0 }, average: { systolic: 0, diastolic: 0 } };
    
    const sum = filteredReadings.reduce((acc, reading) => ({
      systolic: acc.systolic + reading.systolic,
      diastolic: acc.diastolic + reading.diastolic
    }), { systolic: 0, diastolic: 0 });

    return {
      highest: {
        systolic: Math.max(...filteredReadings.map(r => r.systolic)),
        diastolic: Math.max(...filteredReadings.map(r => r.diastolic))
      },
      average: {
        systolic: Math.round(sum.systolic / filteredReadings.length),
        diastolic: Math.round(sum.diastolic / filteredReadings.length)
      }
    };
  }, [filteredReadings]);

  const data = {
    labels: filteredReadings.map(reading => new Date(reading.datetime).toLocaleDateString()),
    datasets: [
      {
        label: 'Systolic',
        data: filteredReadings.map(reading => reading.systolic),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBackgroundColor: filteredReadings.map(reading => getTimeOfDayColor(reading.timeOfDay)),
        pointBorderColor: 'white',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Diastolic',
        data: filteredReadings.map(reading => reading.diastolic),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointBackgroundColor: filteredReadings.map(reading => getTimeOfDayColor(reading.timeOfDay)),
        pointBorderColor: 'white',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${person.charAt(0).toUpperCase() + person.slice(1)}'s Blood Pressure Readings`,
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const reading = filteredReadings[context.dataIndex];
            return `Time of Day: ${reading.timeOfDay} ${getTimeOfDaySymbol(reading.timeOfDay)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 40,
        suggestedMax: 200,
      }
    }
  };

  const toggleTimeOfDay = useCallback((timeOfDay) => {
    setVisibleTimeOfDay(prev => ({
      ...prev,
      [timeOfDay]: !prev[timeOfDay]
    }));
  }, []);

  const chartContainerRef = useRef(null);

  const exportToPDF = useCallback(() => {
    if (chartContainerRef.current) {
      html2canvas(chartContainerRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`${person}_blood_pressure_chart.pdf`);
      });
    }
  }, [person]);

  return (
    <div>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Blood Pressure Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">Highest Values</h4>
            <p className="text-md">
              Systolic: <span className="font-bold text-red-500">{statistics.highest.systolic}</span><br />
              Diastolic: <span className="font-bold text-blue-500">{statistics.highest.diastolic}</span>
            </p>
          </div>
          <div>
            <h4 className="font-medium">Average Values</h4>
            <p className="text-md">
              Systolic: <span className="font-bold text-red-500">{statistics.average.systolic}</span><br />
              Diastolic: <span className="font-bold text-blue-500">{statistics.average.diastolic}</span>
            </p>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef}>
        <Line options={options} data={data} />
        <div className="mt-4 flex justify-center space-x-4 mb-4">
          {Object.entries(visibleTimeOfDay).map(([timeOfDay, isVisible]) => (
            <div 
              key={timeOfDay}
              className={`flex items-center ${isVisible ? 'opacity-100' : 'opacity-50'}`}
            >
              <div 
                className={`w-4 h-4 rounded-full mr-2`}
                style={{ backgroundColor: getTimeOfDayColor(timeOfDay) }}
              ></div>
              <span>{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} {getTimeOfDaySymbol(timeOfDay)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {Object.entries(visibleTimeOfDay).map(([timeOfDay, isVisible]) => (
            <div 
              key={timeOfDay}
              className={`flex items-center cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-50'}`}
              onClick={() => toggleTimeOfDay(timeOfDay)}
            >
              <div 
                className={`w-4 h-4 rounded-full mr-2`}
                style={{ backgroundColor: getTimeOfDayColor(timeOfDay) }}
              ></div>
              <span>{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} {getTimeOfDaySymbol(timeOfDay)}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={exportToPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

export default BloodPressureChart;
