import React, { useState, useEffect } from 'react';
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
            "_id",
            "Item",
            "Unit",
            "Quantity",
            "ReOrder Qty."
        ]];
        
        const tableRows = tableData.map((row) => [
            row._id, row.Item, row.unit, row.Quantity, row.Reorder
        ]);

        const styles = {
            headerRow: {
                fillColor: doc.setFillColor('#FACC15')
                
            }
        };

        doc.autoTable({
            head: headers,
            body: tableRows,
            styles: styles
        });
        

        doc.save('Inventory.pdf');
    } 


return (
    <div>
        <div className='flex justify-center'>
            <button onClick={generatePDF} className='headerButtons m-4'>Download PDF</button>
        </div>
        <div className='flex justify-center mt-4'>
            <table className = 'table-auto border-collapse w-1/2 overflow-scroll'>
            <thead>
            <tr className='bg-gray-100 border hover:bg-gray-200'>
                <th className='px-4 py-2'>ID</th>
                <th className='px-4 py-2'>Item</th>
                <th className='px-4 py-2'>Unit</th>
                <th className='px-4 py-2'>Quantity</th>
                <th className='px-4 py-2'>ReOrder Qty.</th>
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

export default TabletoPDF;
