import React, { useState, useEffect } from 'react';
import SelectComponent from '../checkout/dropdown';
import axios from 'axios';
import '../../../App.css';

const Employees = () => {
    const [employee, setEmployee] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);


    const handleCancel = (e) => {
        e.preventDefault();
        setIsVisible(false);
    }

    const handleAdd = (e) => {
        e.preventDefault();
        setIsVisible(true);
    }

    const setChecked = (e) => {
        setIsAdmin(e.target.checked);
    }

    const addEmp = (e) => {
        e.preventDefault();

        const form = document.querySelector('form');
        let newName = form.querySelector('input[name=empName]');
        let newDept = form.querySelector('input[name=dept]');
        let newEmail = form.querySelector('input[name=email]');

        axios.put('/api/employees/' + newName.value + '/new',
        {
            Name: newName.value,
            Dept: newDept.value,
            Email: newEmail.value,
            Admin: isAdmin
        });
        setIsVisible(false);
    };

    async function editEmp(emp) {
        let editName = form.querySelector('input[name=editEmpName]');
        let editDept = form.querySelector('input[name=editDept]');
        let editEmail = form.querySelector('input[name=editEmail]');

        axios.put('/api/employees/' + emp.Name +'/edit', 
                    {
                        Name: editName.value,
                        Dept: editDept.value,
                        Email: editEmail.value,
                        Admin: isAdmin,
                    }
                )

    }

    async function deleteEmp (emp) {
        await axios.delete('/api/employees/' + emp.Name +'/delete');
        setEmployee(employee.filter(p => p._id !== emp._id));
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

    return(
        <div>
            <div className="w-full flex flex-col min-h-[85%]">
                <div className='w-full flex justify-center flex-row mt-4 mb-6'>
                    <button className='headerButtons'
                    onClick={(e) => handleAdd(e)}>Add Employee</button>
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
                                <button className='bg-yellow-400 font-semibold rounded-md mx-2 px-4'
                                onClick={() => editEmp(emp)}>Edit</button>
                                <button className='bg-red-500 font-semibold rounded-md mx-2 px-4'
                                onClick={() => deleteEmp(emp)}>Delete</button>
                            </td>
                        </tr>
                            
                    ))}
                    </tbody>
                </table>
            </div>
            <div className={`fixed top-0 left-0 right-0 bottom-0 w-full bg-neutral-500 bg-opacity-30 z-50 flex items-center justify-center h-full ${isVisible ? '' : 'hidden'}`}>
                <form className='bg-yellow-400 w-1/3 flex justify-center rounded-lg shadow-md my-6'>
                    <div className='w-full mx-10'>
                        <div className='w-full flex justify-center '>
                            <label className='m-auto flex justify-center font-bold text-xl my-6 mb-8'>Add Employee</label>
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>Name:</label>
                            <input name='empName' className='w-1/2 rounded-sm shadow-sm' />
                        </div>
                        <div className='w-full flex justify-center my-4'>
                            <label className='pr-2'>Department:</label>
                            <input name='dept' className='w-1/2 rounded-sm shadow-sm' /> 
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>E-Mail:</label>
                            <input name='email' type='email' className='w-1/2 rounded-sm shadow-sm'></input> 
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>Admin:</label>
                            <input name='admin' type='checkbox' className='rounded-sm shadow-sm'
                             onChange={setChecked}/> 
                        </div>
                        <div className='flex justify-center mb-6'>
                            <button className='border border-black bg-green-600 p-2 rounded-md m-4'
                            onClick={(e) => addEmp(e)}>Submit</button>
                            <button className='border border-black bg-red-600 p-2 rounded-md m-4'
                            onClick={((e) => handleCancel(e))}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className={`fixed top-0 left-0 right-0 bottom-0 w-full bg-neutral-500 bg-opacity-30 z-50 flex items-center justify-center h-full ${isVisible ? '' : 'hidden'}`}>
                <form className='bg-yellow-400 w-1/3 flex justify-center rounded-lg shadow-md my-6'>
                    <div className='w-full mx-10'>
                        <div className='w-full flex justify-center '>
                            <label className='m-auto flex justify-center font-bold text-xl my-6 mb-8'>Edit Employee</label>
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>Name:</label>
                            <input name='editEmpName' className='w-1/2 rounded-sm shadow-sm'/>
                        </div>
                        <div className='w-full flex justify-center my-4'>
                            <label className='pr-2'>Department:</label>
                            <input name='editDept' className='w-1/2 rounded-sm shadow-sm' /> 
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>E-Mail:</label>
                            <input name='editEmail' type='email' className='w-1/2 rounded-sm shadow-sm'></input> 
                        </div>
                        <div className='flex justify-center w-full my-4'>
                            <label className='pr-2'>Admin:</label>
                            <input name='editAdmin' type='checkbox' className='rounded-sm shadow-sm'
                             onChange={setChecked}/> 
                        </div>
                        <div className='flex justify-center mb-6'>
                            <button className='border border-black bg-green-600 p-2 rounded-md m-4'
                            onClick={(e) => addEmp(e)}>Submit</button>
                            <button className='border border-black bg-red-600 p-2 rounded-md m-4'
                            onClick={((e) => handleCancel(e))}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      );

}

export default Employees;