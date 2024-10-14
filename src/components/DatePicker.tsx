import React from 'react';
import './DatePicker.css'; // Create this CSS file for styling

interface DatePickerProps {
    startDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    endDate: Date | null;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const DatePicker: React.FC<DatePickerProps> = ({ startDate, setStartDate, endDate, setEndDate }) => {
    return (
        <div className="date-picker-container">
            <h2>Select Date Range</h2>
            <input
                type="date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <input
                type="date"
                onChange={(e) => setEndDate(new Date(e.target.value))}
            />
        </div>
    );
};
