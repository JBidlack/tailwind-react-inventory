import React, { useState, useEffect } from 'react';
import withAuth from '../Authenticated.jsx'
import '../../../App.css'
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TabletoPDF = () => {
    const [tableData, setTableData] = useState([]);

    const fetchData = async () => {
        const result = await axios.get('/api/items');
        setTableData(result.data);
    }

    useEffect(() => {
        fetchData();
      }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        
        const headers = [[
            {content: 'ID', styles: {fillColor: '#FACC15', textColor: '#000000'}},
            {content: 'Item', styles: {fillColor: '#FACC15', textColor: '#000000'}},
            {content: 'Unit', styles: {fillColor: '#FACC15', textColor: '#000000'}},
            {content: 'Quantity', styles: {fillColor: '#FACC15', textColor: '#000000'}},
            {content: 'ReOrder Qty.', styles: {fillColor: '#FACC15', textColor: '#000000'}}
        ]];
        
        const tableRows = tableData.map((row) => [
            row._id, row.Item, row.unit, row.Quantity, row.Reorder
        ]);

        doc.autoTable({
            head: headers,
            body: tableRows,
            headStyles: {fillColor: '#FACC15'},

        });
        

        doc.save('Inventory.pdf');
    } 


return (
    <div>
        <div className='flex justify-center'>
            <button onClick={generatePDF} className='headerButtons m-4'>Download PDF</button>
        </div>
        <div className='flex justify-center mt-4'>
            <table className = 'table-auto shadow-lg border-collapse w-1/2 overflow-scroll'>
            <thead>
            <tr className='bg-gray-100 border hover:bg-gray-200'>
                <th className='px-4 py-2 bg-yellow-400'>ID</th>
                <th className='px-4 py-2 bg-yellow-400'>Item</th>
                <th className='px-4 py-2 bg-yellow-400'>Unit</th>
                <th className='px-4 py-2 bg-yellow-400'>Quantity</th>
                <th className='px-4 py-2 bg-yellow-400'>ReOrder Qty.</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map(row => (
                <tr key={row._id} className='bg-gray-100 border hover:bg-gray-200'>
                <td className='border px-4 py-2'>{row._id}</td>
                <td className='border px-4 py-2'>{row.Item}</td>
                <td className='border px-4 py-2'>{row.unit}</td>
                <td className='border px-4 py-2'>{row.Quantity}</td>
                <td className='border px-4 py-2'>{row.Reorder}</td>
                </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>);
};

export default withAuth(TabletoPDF);
