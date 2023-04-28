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
      }, [employee]);

      const deleteEmp = (name) => {
        axios.delete(`/api/employees/?Name=${name}`)
      }

    return(
        <div>
            <div className="w-full flex flex-col min-h-[85%]">
                <div className='w-full flex justify-center flex-row mt-4 mb-6'>
                    <button className='headerButtons'>Add Employee</button>
                </div>
            </div>
            <div className='flex justify-center mx-8'>
                <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                    <li className='flex flex-col justify-center font-bold pb-4 text-center'>Employee Name</li> 
                    {employee &&
                    employee.map((name, index) => (
                        <li key={`${name.Name}_${index}`} className='flex justify-center border-b 
                        border-gray-800 mb-2 bg-white' id = 'part-id'> 
                            <p className='my-2'>{name.Name}</p>
                        </li>
                    ))}
                </ul>
                <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                    <li className='flex flex-col justify-center font-bold pb-4 text-center'>Department</li>   
                    {employee &&
                    employee.map((name, index) => (
                        <li key={`${name.Dept}_${index}`} className='flex justify-center border-b 
                        border-gray-800 mb-2 bg-white'> 
                            <p className='my-2'>{name.Dept}</p>
                        </li>
                    ))}
                </ul>
                <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                    <li className='flex flex-col justify-center font-bold pb-4 text-center'>Remove/Edit</li> 
                    {employee &&
                    employee.map((name) => (
                        <li key={`${name._id}`} className='flex justify-center border-b 
                        border-gray-800 mb-2 bg-white'> 
                            <button className='bg-yellow-400 rounded-md px-2 m-2 '>Edit</button>
                            <button className='bg-red-500 rounded-md px-2 m-2'
                            onClick={() => deleteEmp(name.Name)}>Delete</button>
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
                            <th className='m-10 p-2'>Remove/Edit</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
      );

}

export default Employees;