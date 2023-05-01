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

    async function deleteEmp (emp) {
        console.log(emp)
        await axios.delete('/api/employees/' + emp.Name +'/delete');
        setEmployee(employee.filter(p => p._id !== emp._id));
    };

    

    return(
        <div>
            <div className="w-full flex flex-col min-h-[85%]">
                <div className='w-full flex justify-center flex-row mt-4 mb-6'>
                    <button className='headerButtons'>Add Employee</button>
                </div>
            </div>
            <div className='flex  w-2/3 mx-auto'>
            <table className='flex flex-col justify-center list-none w-full bg-white'>
                <thead className='flex justify-center w-full text-sm font-bold bg-yellow-400'>
                    <tr className='flex w-full p-2'>
                        <th className='w-1/3 mx-10 p-2'>Employee Name</th>
                        <th className='w-1/3 mx-10 p-2'>Department</th>
                        <th className='w-1/3 mx-10 p-2'>Remove/Edit</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {employee.map((emp, index) => (
                        <tr key = {`${emp._id}_${index}`} className='flex w-full p-2'>
                            <td className='flex justify-center w-1/3 mx-10 p-2'> {emp.Name}</td>
                            <td className='flex justify-center w-1/3 mx-10 p-2'> {emp.Dept}</td>
                            <td className='flex justify-center w-1/3 mx-10 p-2'> 
                                <button className='bg-yellow-400 font-semibold rounded-md mx-2 px-4'>Edit</button>
                                <button className='bg-red-500 font-semibold rounded-md mx-2 px-4'
                                onClick={() => deleteEmp(emp)}>Delete</button>
                            </td>
                        </tr>
                            
                    ))}
                    </tbody>
                </table>
            </div>
            <div className='w-full bg-neutral-500 bg-opacity-20 z-50 flex items-center justify-center h-full'>
                <form className='bg-yellow-400 w-1/2 h-2/3  flex justify-center rounded-md shadow-md'>
                    <div>
                        <div className='w-full flex justify-center '>
                            <label className='m-auto flex justify-center font-bold text-xl my-3 mb-8'>Add Employee</label>
                        </div>
                        <div className='w-full my-4'>
                            <label className='pr-2'>Name:</label>
                            <input className='w-2/3 rounded-sm shadow-sm'></input> 
                        </div>
                        <div className='w-full my-4'>
                            <label className='pr-2'>Department:</label>
                            <input className='w-2/3 rounded-sm shadow-sm'></input> 
                        </div>
                    </div>
                </form>
            </div>
        </div>
      );

}

export default Employees;