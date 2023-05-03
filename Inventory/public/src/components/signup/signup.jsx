import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import '../../App.css'


function SignUp() {

    const [userExists, setUserExists] = useState(false);
    const navigate = useNavigate();
    const [un, setUn] = useState({
        name: "",
        email: "",
        password: "",
    });

    const newAcct = async (e) => {

        e.preventDefault();

    }

    return(
        <div className ='h-screen flex justify-center items-center content-center pt-20'>
            <form className='bg-yellow-400 flex justify-start flex-col items-left 
                w-1/4 h-1/2 p-10 rounded-lg shadow-md'>
                <div className='flex justify-start pb-10'>
                    <label className='flex justify-center font-bold text-xl w-full'>New User Sign-Up</label>
                </div>
                {userExists && <div className='flex justify-center text-base text-red-600
                font-extrabold pb-4'>User already exists. </div>}
                <div className='flex flex-col justify-start pb-10'>
                    <label 
                        htmlFor='name'
                        className='text-sm pr-4 block'>Please Enter your Name:</label>
                    <input 
                        name='name'
                        type='text' 
                        className='gap-4 rounded-md border-gray-500 shadow-md p-1 block' 
                        required
                    />
                </div>
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
                        className='text-sm pr-4 block'>Choose a Password:</label>
                    <input 
                        name='pass' 
                        type='password' 
                        className='gap-4 rounded-md border-gray-500 shadow-md p-1 block'
                        required
                    />
                </div>
                <div className='flex justify-center align-middle'>
                    <button type='submit' className='bg-black text-yellow-400 
                        py-2 p-3 rounded-lg' onClick={newAcct}>
                            Sign Up
                    </button>
                </div>
                <div className='flex justify-center align-middle pt-2'>
                        <a href='/login' >Log-In Here</a>
                </div>
            </form>
        </div>
    );
}

export default SignUp
