




import React, { useEffect, useState } from "react";
import {Link, Outlet, useNavigate} from 'react-router-dom'
import { account } from '../appwriteConfig';
import '../../App.css';

const Header = () => {

    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState();

    useEffect(() => {
        const getData = account.get()
        getData.then(
            function(response){
                setUserDetails(response);
            },
            function (error) {
                console.log(error);
            }
        )
    }, [])

    const logOut = async (e) => {
        e.preventDefault();
    
        try{
            await account.deleteSession("current");
            navigate('/login');    
        } catch (error){
                alert('Something went wrong! Please try again.');
        }
    }

    return(
        <>
            <div className="m-0 py-6 bg-black min-h-[25%]  max-h-[25%]">
                <div className="flex items-center justify-center border-t-2 border-b-2 border-yellow-400">
                    <div className="py-2">
                        <div className="flex justify-center space-x-6">
                            <Link to="/logged/checkout">
                                <button className='headerButtons'>Employee Check Out</button>
                            </Link>
                            <Link to="/logged/tool">
                                <button className='headerButtons'>Tool Inventory</button>
                            </Link>
                            <Link to="/logged/checkin">
                                <button className='headerButtons'>Check-In Inventory</button>
                            </Link>
                            <Link to="/logged/print">
                                <button className='headerButtons'>Print Inventory</button>
                            </Link>
                            <Link to="/logged/editList">
                                <button className='headerButtons'>Edit Employee List</button>
                            </Link>
                            <Link to="/login">
                                <button className="headerButtons" onClick={logOut}> Log-Out </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <Outlet />
        </>
    );
}

export default Header;