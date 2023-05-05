import React, { useEffect, useState } from "react";
import {Link, Outlet, useNavigate} from 'react-router-dom'
import TabletoPDF from '../body/printInv/print'
import '../../App.css';


const Header = () => {

    const logout = (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        
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
                            <Link to="/logged/checkin">
                                <button className='headerButtons'>Check-In Inventory</button>
                            </Link>
                            <Link to="/logged/print">
                                <button className='headerButtons' onClick ={ TabletoPDF.pdf }>Print Inventory</button>
                            </Link>
                            <Link to="/logged/editList">
                                <button className='headerButtons'>Edit Employee List</button>
                            </Link>
                                <button className="headerButtons" onClick={(e) => logout(e) }> Log-Out </button>
                        </div>
                    </div>
                </div>
            </div>            
            <Outlet />
        </>
    );
}

export default Header;