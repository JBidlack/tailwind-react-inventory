import React from "react";
import ClipLoader from 'react-spinners/ClipLoader'


const Loading = () => {

    return(
        <div className="fixed inset-0 items-center z-50 bg-slate-500 bg-transparent">
            <div className="flex justify-center w-full min-h-full">
                <div className="flex flex-grow flex-col justify-center items-center">
                    <ClipLoader size={30} color={"#000000"} />
                    <p className="my-4 text-xl">Loading...</p>
                    <p className="mt-2">Please be patient as we</p>
                    <p>connect to the database</p>
                </div>
            </div>

        </div>)
}

export default Loading