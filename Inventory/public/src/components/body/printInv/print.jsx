import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TabletoPDF = () => {
    const [tableData, setTableData] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/api/items');
            setTableData(result.data);
        };

        fetchData();
    }, []);

    const pdf = () => {
        const doc = new jsPDF();
        const headers = [["_id",
            "Item",
            "Unit",
            "Quantity",
            "ReOrder Qty."]];
        
        const tableRows = tableData.map((row) => [
            row._id, row.Item, row.unit, row.Quantity, row.Reorder
        ]);

        doc.autoTable({
            head: headers,
            body: tableRows,
        });

        doc.save('Inventory.pdf');
    }
    pdf();
}

export default TabletoPDF;
