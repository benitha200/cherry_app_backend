import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import {  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Sector } from 'recharts';
import { BaggageClaim, BarChart3Icon, BarChartBig, CoinsIcon } from 'lucide-react';

const NewDashboard = () => {
  const [cwsName, setCwsName] = useState(['All', 'GASEKE', 'KANYEGE', 'KARAMBI', 'KARENGE', 'KAYUMBU', 'KAZO', 'KIBIRIZI']);
  const [cherryGrade, setCherryGrade] = useState(['All', 'CA', 'NA', 'CB', 'NB']);
  const [year, setYear] = useState(['2024']);
  const [month, setMonth] = useState(['All', 'January', 'February', 'March', 'April']);
  const [date, setDate] = useState(['All', '8', '9', '10', '12', '13', '14', '15']);

  const metricData = {
    'Traceable Cherry (KG)': 1897982,
    'Finance Cherry (KG)': 2099969,
    'Traceable Rwf': 1165398582,
    'Finance Rwf': 1300281784,
    'Non-Traceable (KG)': 201987,
    'Non-Traceable (Rwf)': 134883202
  };

  const traceableFinanceData = [
    { date: 'Feb 2024', Traceable: 250, Finance: 470 },
    { date: 'Mar 2024', Traceable: 150, Finance: 100 },
    { date: 'Apr 2024', Traceable: 380, Finance: 400 },
    { date: 'May 2024', Traceable: 170, Finance: 200 },
  ];

  const traceableFinanceCherryData = [
    { date: '8', Traceable: 10, Finance: 20, CWSName: 'MUSASA' },
    { date: '9', Traceable: 15, Finance: 25, CWSName: 'MUSASA' },
    { date: '10', Traceable: 20, Finance: 30, CWSName: 'MUSASA' },
    { date: '12', Traceable: 25, Finance: 35, CWSName: 'MUSASA' },
    { date: '13', Traceable: 30, Finance: 40, CWSName: 'MUSASA' },
    { date: '14', Traceable: 35, Finance: 45, CWSName: 'MUSASA' },
    { date: '15', Traceable: 40, Finance: 50, CWSName: 'MUSASA' },
  ];

  const cherryGradeData = [
    { name: 'CA', value: 0.62 },
    { name: 'NA', value: 0.32 },
    { name: 'CB', value: 0.03 },
    { name: 'NB', value: 0.03 },
    { name: 'Blank', value: 0.0191 },
  ];

  return (
    <div>
      {/* Metric Cards */}
      <div className="flex flex-row col-12 gap-2"> 
        {Object.entries(metricData).map(([name, value]) => (
          <Card key={name} className="bg-white rounded-lg shadow-md p-5 col-2/12">
            <div className="flex flex-col  gap-2 justify-between justify-center h-100">
                <BarChartBig style={{ width: '30%', height: '30%',alignSelf:'center' }} />

            <p className="text-4xl font-bold ">{value}</p>
            <h3 className="text-lg font-bold mb-2 text-teal-600">{name}</h3>
            
            </div>
            
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-row gap-2 m-4">
      <MultiSelect
        value={['All']} 
        onChange={(e) => {
            if (e.value.includes('All')) {
            setCwsName(['All', 'GASEKE', 'KANYEGE', 'KARAMBI', 'KARENGE', 'KAYUMBU', 'KAZO', 'KIBIRIZI']);
            } else {
            // If 'All' is deselected, remove 'All' from the value
            setCwsName(e.value.filter(option => option !== 'All'));
            }
        }}
        options={['All', 'GASEKE', 'KANYEGE', 'KARAMBI', 'KARENGE', 'KAYUMBU', 'KAZO', 'KIBIRIZI']}
        placeholder="CWS Name"
        className="w-full"
        />

    <MultiSelect
    value={['All']} // Default value set to ['All']
    onChange={(e) => {
        if (e.value.includes('All')) {
        // If 'All' is selected, set cherryGrade to all options
        setCherryGrade(['All', 'CA', 'NA', 'CB', 'NB']);
        } else {
        // If 'All' is deselected, remove 'All' from cherryGrade
        setCherryGrade(e.value.filter(option => option !== 'All'));
        }
    }}
    options={['All', 'CA', 'NA', 'CB', 'NB']}
    placeholder="Cherry Grade"
    className="w-full"
    />

    <MultiSelect
    value={['2024']} // Default value set to ['2024']
    onChange={(e) => setYear(e.value)}
    options={['2024']}
    placeholder="Year"
    className="w-full"
    />

    <MultiSelect
    value={['All']} // Default value set to ['All']
    onChange={(e) => {
        if (e.value.includes('All')) {
        // If 'All' is selected, set month to all options
        setMonth(['All', 'January', 'February', 'March', 'April']);
        } else {
        // If 'All' is deselected, remove 'All' from month
        setMonth(e.value.filter(option => option !== 'All'));
        }
    }}
    options={['All', 'January', 'February', 'March', 'April']}
    placeholder="Month"
    className="w-full"
    />

    <MultiSelect
    value={['All']} // Default value set to ['All']
    onChange={(e) => {
        if (e.value.includes('All')) {
        // If 'All' is selected, set date to all options
        setDate(['All', '8', '9', '10', '12', '13', '14', '15']);
        } else {
        // If 'All' is deselected, remove 'All' from date
        setDate(e.value.filter(option => option !== 'All'));
        }
    }}
    options={['All', '8', '9', '10', '12', '13', '14', '15']}
    placeholder="Date"
    className="w-full"
    />

      </div>

      {/* Charts */}
      <div className="flex flex-row w-100 gap-4">
        <Card className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-bold mb-2">Traceable and Finance Rwf by Date</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={traceableFinanceData}>
                
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Traceable" stroke="#4bc0c0" fill="#4bc0c0" />
                <Area type="monotone" dataKey="Finance" stroke="#36A2EB" fill="#36A2EB" />
            </AreaChart>



          </ResponsiveContainer>
        </Card>

        <Card className="bg-white rounded-lg shadow-md p-4">
            <div className='w-100'>
            <h3 className="text-lg font-bold mb-2">Cherry Kg by Cherry Grade</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie data={cherryGradeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#4bc0c0" label />
                </PieChart>
            </ResponsiveContainer>
            </div>
         
        </Card>
      </div>
      <div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        <Card className="bg-white rounded-lg shadow-md p-4 mt-3 w-100">
                <h3 className="text-lg font-bold mb-2">Traceable and Finance Cherry (Kg) by Date and CWS Name</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={traceableFinanceCherryData}>
                    <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 'auto']} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Traceable" fill="#4bc0c0" />
                    <Bar dataKey="Finance" fill="#36A2EB" />
                </BarChart>
            </ResponsiveContainer>
            
        </Card>

        </div>
    </div>

    </div>
  );
};

export default NewDashboard;