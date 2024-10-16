import NavLink from '@/Components/NavLink';
import React from 'react'

export default function Unauthorized({ error }) {
    return (
        <div className="flex items-center justify-center w-full h-[100vh] ">
            <div>
                <div className="w-full flex justify-center items-center">
                    <img
                        src="/images/unauthorized.png"
                        alt="Torch Logo"
                        className="w-60 h-60 overflow-hidden"
                    />
                </div>
                <h2 className="sm:text-sm lg:text-xl text-red-500 mt-4">
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
