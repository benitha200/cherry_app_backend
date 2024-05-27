import React, { useState } from 'react';
import FinancialReport from './FinancialReport';

const FinancialReportContainer = ({token}) => {
  const [date_, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className='w-100'>
      <FinancialReport date={date_} onDateChange={handleDateChange} token={token} />
    </div>
  );
};

export default FinancialReportContainer;
