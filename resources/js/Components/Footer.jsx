import { Link } from '@inertiajs/react';
import React from 'react'

export default function Footer() {
    return (
        <>
            <footer className="bg-custom-gradient py-8 mt-8 flex flex-col lg:items-center ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="my-4 bg-white h-[1px] w-full"></div>

                    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
                        <div>
                            <h1 className="font-bold text-white mb-4">TCGC</h1>
                            <ul className="text-white">
                                <li>Tangub City, Misamis Occidental</li>
                                <li>(088)-545-2793</li>
                                <li>
                                    <a href="gadtc@gadtc.edu.ph" target="blank">
                                        gadtc@gadtc.edu.ph
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/tcgcluxmundi"
                                        target="blank"
                                    >
                                        facebook.com/tcgcluxmundi
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-bold text-white mb-4">
                                The Torch Publication
                            </h2>
                            <p className="text-white">
                                    The Torch is Tangub City Global College's
                                    official publication. 
                            </p>
                        </div>

                        <div>
                            <div className="text-white font-bold mb-4">
                                <a href="">The Torch Socials</a>
                            </div>
                            <ul className="text-white">
                                <li>
                                    <a href="torch@gmail.com" target="blank">
                                        torch@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/TheTORCHofficialpage"
                                        target="blank"
                                    >
                                        facebook.com/TheTORCHofficialpage
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-white mt-6 text-center">
                    ©Torch Publication | All Rights Reserved
                </div>
            </footer>
        </>
    );
}
