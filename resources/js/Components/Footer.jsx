import React from 'react'

export default function Footer() {
    return (
        <>
            <footer className="bg-custom-gradient py-8 mt-8 flex flex-col lg:items-center ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="my-4 bg-white h-[1px] w-full"></div>

                    <div className="flex flex-col justify-around gap-6 lg:flex-row">
                        <div className="flex-1">
                            <h1 className="font-bold text-white mb-4">TCGC</h1>
                            <ul className="text-white">
                                <li>Tangub City, Misamis Occidental</li>
                                <li>(088)-545-2793</li>
                                <li>gadtc@gadtc.edu.ph</li>
                                <li>www.facebook.com/gadtcluxmundi</li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-white mb-4">
                                The Torch Publication
                            </h2>
                            <p className="text-white">
                                The Torch is Tangub City Global College's
                                official publication. "Lorem ipsum dolor sit
                                amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore
                                magna aliqua.
                            </p>
                        </div>

                        <div className="flex-1">
                            <div className="text-white font-bold mb-4">
                                <a href="">The Torch</a>
                            </div>
                            <div className="text-white">
                                <a href="">torch@gmail.com</a>
                            </div>
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
