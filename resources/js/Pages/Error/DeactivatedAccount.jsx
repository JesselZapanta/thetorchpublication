import { Link } from '@inertiajs/react';
import React from 'react'

export default function DeactivatedAccount() {
    return (
        <div className="flex items-center justify-center w-full h-[100vh] ">
            <div>
                <div className="w-full flex justify-center items-center">
                    <img
                        src="/images/deactivated.png"
                        alt="Torch Logo"
                        className="w-60 h-60 overflow-hidden"
                    />
                </div>
                <h2 className="sm:text-sm lg:text-xl text-center text-red-500 mt-4">
                    Your account has been deactivated. <br /> Please contact or
                    visit Torch Office for account reactivation process. <br />
                    Thank you!
                </h2>
                {/*  {error && <p className="text-red-500 mt-4">{error}</p>} */}
                <div className="w-full flex mt-4 justify-center gap-4">
                    <a
                        className="px-4 py-2 text-nowrap flex gap-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                        href={route("home")}
                    >
                        Back to Home
                    </a>

                    <Link
                        className="px-4 py-2 text-nowrap flex gap-2 bg-rose-600 text-white transition-all duration-300 rounded hover:bg-rose-700"
                        method="post"
                        href={route("logout")}
                        as="button"
                    >
                        Log Out
                    </Link>
                </div>
            </div>
        </div>
    );
}
