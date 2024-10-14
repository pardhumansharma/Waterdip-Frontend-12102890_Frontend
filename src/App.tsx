import React, { useState } from 'react';
import { Chart } from './components/Chart';
import { DatePicker } from './components/DatePicker';
import parseCSV from './utils/parseCSV';
import './App.css';

const App = () => {
    const [data, setData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const parsedData = parseCSV(text);
                setData(parsedData);
            };
            reader.readAsText(file);
        }
    };

    const filteredData = data.filter((row) => {
        const date = new Date(`${row.arrival_date_year}-${row.arrival_date_month}-${row.arrival_date_day_of_month}`);
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });

    return (
        <div className="app-container">
            <h1 className="app-title">Hotel Booking Dashboard</h1>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />
            <DatePicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            <div className="charts-container">
                <Chart data={filteredData} />
            </div>
        </div>
    );
};

export default App;
