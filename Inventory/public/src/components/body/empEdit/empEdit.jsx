import React, { useState, useEffect } from 'react';
import SelectComponent from '../checkout/dropdown';
import axios from 'axios';
import '../../../App.css';

const Employees = () => {
    const [employee, setEmployee] = useState([]);
    const [loader, setLoader] = useState(false);
    const [showForm, setShowForm] = useState(false);


    const handleClick = () => {
        setShowForm(true);
      };

    useEffect(() => {
        setLoader(true);
        axios.get('/api/employees')
            .then((response) => {
                const data = response.data;
                setEmployee(data);
                setLoader(false);
            })
            .catch((error) => {
                console.log(error);
                setLoader(false);
            });
      }, []);

    return(
      <div className="w-full flex flex-col min-h-[85%]">
        <div className='w-full flex justify-center flex-row mt-4 mb-6'>
            <button className='headerButtons'>Add Employee</button>
        </div>
        <div className='flex justify-center w-full ml-8 mr-8'>
            <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                <li className='flex flex-col justify-center font-bold pb-4 text-center'>Employee Name</li> 
                {employee &&
                employee.map((name, index) => (
                    <li key={`${name.Name}_${index}`} className='flex justify-center border-b 
                    border-gray-800 mb-2 bg-white' id = 'part-id'> 
                        {name.Name}
                    </li>
                ))}
            </ul>
            <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                <li className='flex flex-col justify-center font-bold pb-4 text-center'>Department</li>   
                {employee &&
                employee.map((name, index) => (
                    <li key={`${name.Dept}_${index}`} className='flex justify-center border-b 
                    border-gray-800 mb-2 bg-white'> 
                        {name.Dept}
                    </li>
                ))}
            </ul>
            <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                <li className='flex flex-col justify-center font-bold pb-4 text-center'></li> 
                {employee &&
                employee.map((name, index) => (
                    <li key={`${name._id}_${index}`} className='flex justify-center border-b 
                    border-gray-800 mb-2 bg-white'> 
                        <button>Delete</button>
                    </li>
                ))}
            </ul>
            </div>
            <div>
            <table className='hidden'>
                <thead className='text-sm font-bold mb-6 bg-yellow-400'>
                    <tr className='p-2'>
                        <th className='m-10 p-2'>Employee Name</th>
                        <th className='m-10 p-2'>Department</th>
                        <th className='m-10 p-2'> </th>
                    </tr>
                </thead>
            </table>
        </div>
      </div>);

}

export default Employees;