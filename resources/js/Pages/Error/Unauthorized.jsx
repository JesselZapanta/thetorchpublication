import NavLink from '@/Components/NavLink';
import React from 'react'

export default function Unauthorized({ error }) {
    return (
        <div className="flex items-center justify-center w-full h-[100vh] ">
            <div>
                <h2 className="text-2xl text-red-500 mt-4">
                    You do not have permission to access this page. Thank you!
                    {/* {error && <p className="">{error}</p>} */}
                </h2>
                <div className="w-full flex mt-4 justify-center">
                    <a
                        className="px-4 py-2 text-nowrap flex gap-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                        href={route("home")}
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
