import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../../App.css'


function LogIn() {

    const [userError, setUserError] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     async function fetchData() {
    //       try {
    //         const response = await axios.get('/api/items');
    //         const warmup =response.data;
    //       } catch (err) {
    //         console.error(err);
    //       }
    //     }
    //     fetchData();
    //   }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate('/signup');
    }

    const loginUser = async (e) => {
        e.preventDefault();

        const un = document.querySelector('input[name=email]');
        const pw = document.querySelector('input[name=pass]');

        try{
            const response = await axios.post('/login/' + un.value, {
                username: un.value,
                password: pw.value
            });

            localStorage.setItem('token', response.data.token);
            navigate('../logged/checkout');
            
        } catch (error){
            setUserError(true);
        }
    }

    

    return(
        <div className ='h-screen flex justify-center items-center content-center pt-20'>
            <form className='bg-yellow-400 flex justify-start flex-col items-left 
                w-1/4 h-1/2 p-10 rounded-lg shadow-md'>
                <div className='flex justify-start pb-10'>
                    <label className='flex justify-center font-bold text-xl w-full'>User Sign-In</label>
                </div>
                {userError && <div className='flex justify-center text-base text-red-600
                font-extrabold pb-4'>Username or Password is incorrect. Please try again. </div>}
                <div className='flex flex-col justify-center pb-10'>
                    <label htmlFor='email' className='text-sm pr-4 block'>Enter your E-Mail:</label>
                    <input 
                        name='email' 
                        type='email' 
                        className= 'gap-4 rounded-md border-gray-500 shadow-md p-1 block'
                        required
                    />
                </div>
                <div className='flex flex-col justify-center pb-20'>
                    <label 
                        htmlFor='password'
                        className='text-sm pr-4 block'>Enter Password:</label>
                    <input 
                        name='pass' 
                        type='password' 
                        className='gap-4 rounded-md border-gray-500 shadow-md p-1 block'
                        required
                    />
                </div>
                <div className='flex justify-center align-middle'>
                    <button type='submit' className='bg-black text-yellow-400 
                        py-2 p-3 rounded-lg' onClick={(e) => loginUser(e)}>
                            Log-In
                    </button>
                </div>
                <div className='flex justify-center align-middle pt-2'>
                        <button type='submit' onClick={(e) =>handleSubmit(e)} className=' bg-transparent'>Sign-Up Here</button>
                </div>
            </form>
        </div>
    );
}

export default LogIn;