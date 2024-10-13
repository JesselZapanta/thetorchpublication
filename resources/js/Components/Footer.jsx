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
                            <h1 className="font-bold text-white mb-4">
                                Tangub City Global College{" "}
                            </h1>
                            <ul className="text-white flex flex-col gap-2">
                                <li className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 64 64"
                                        id="Location"
                                    >
                                        <path
                                            fill="#595bd4"
                                            d="M50.4,18.41a18.4,18.4,0,1,0-36.8,0C13.6,28.57,32,54.26,32,54.26S50.4,28.57,50.4,18.41ZM20,18.41a12,12,0,1,1,12,12A12,12,0,0,1,20,18.41Z"
                                            className="color1e252d svgShape"
                                        ></path>
                                        <path
                                            fill="#595bd4"
                                            d="M41.26,43c-1.38,2.25-2.72,4.33-3.9,6.11,5,.68,8.5,2.28,8.5,4.16,0,2.48-6.2,4.5-13.86,4.5s-13.86-2-13.86-4.5c0-1.89,3.52-3.49,8.51-4.16-1.18-1.78-2.52-3.87-3.9-6.12C10.65,44.36,1.91,48.42,1.91,53.23,1.91,59.18,15.38,64,32,64s30.09-4.82,30.09-10.77C62.09,48.42,53.35,44.36,41.26,43Z"
                                            className="color1e252d svgShape"
                                        ></path>
                                    </svg>
                                    Tangub City, Misamis Occidental
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 48 48"
                                    >
                                        <path
                                            fill="#0f0"
                                            d="M13,42h22c3.866,0,7-3.134,7-7V13c0-3.866-3.134-7-7-7H13c-3.866,0-7,3.134-7,7v22	C6,38.866,9.134,42,13,42z"
                                        ></path>
                                        <path
                                            fill="#fff"
                                            d="M35.45,31.041l-4.612-3.051c-0.563-0.341-1.267-0.347-1.836-0.017c0,0,0,0-1.978,1.153	c-0.265,0.154-0.52,0.183-0.726,0.145c-0.262-0.048-0.442-0.191-0.454-0.201c-1.087-0.797-2.357-1.852-3.711-3.205	c-1.353-1.353-2.408-2.623-3.205-3.711c-0.009-0.013-0.153-0.193-0.201-0.454c-0.037-0.206-0.009-0.46,0.145-0.726	c1.153-1.978,1.153-1.978,1.153-1.978c0.331-0.569,0.324-1.274-0.017-1.836l-3.051-4.612c-0.378-0.571-1.151-0.722-1.714-0.332	c0,0-1.445,0.989-1.922,1.325c-0.764,0.538-1.01,1.356-1.011,2.496c-0.002,1.604,1.38,6.629,7.201,12.45l0,0l0,0l0,0l0,0	c5.822,5.822,10.846,7.203,12.45,7.201c1.14-0.001,1.958-0.248,2.496-1.011c0.336-0.477,1.325-1.922,1.325-1.922	C36.172,32.192,36.022,31.419,35.45,31.041z"
                                        ></path>
                                    </svg>
                                    (088)-545-2793
                                </li>
                                <li>
                                    <a
                                        href="mailto:gadtc@gadtc.edu.ph"
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                fill="#1e88e5"
                                                d="M34,42H14c-4.411,0-8-3.589-8-8V14c0-4.411,3.589-8,8-8h20c4.411,0,8,3.589,8,8v20 C42,38.411,38.411,42,34,42z"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M35.926,17.488L29.414,24l6.511,6.511C35.969,30.347,36,30.178,36,30V18 C36,17.822,35.969,17.653,35.926,17.488z M26.688,23.899l7.824-7.825C34.347,16.031,34.178,16,34,16H14 c-0.178,0-0.347,0.031-0.512,0.074l7.824,7.825C22.795,25.38,25.205,25.38,26.688,23.899z M24,27.009 c-1.44,0-2.873-0.542-3.99-1.605l-6.522,6.522C13.653,31.969,13.822,32,14,32h20c0.178,0,0.347-0.031,0.512-0.074l-6.522-6.522 C26.873,26.467,25.44,27.009,24,27.009z M12.074,17.488C12.031,17.653,12,17.822,12,18v12c0,0.178,0.031,0.347,0.074,0.512 L18.586,24L12.074,17.488z"
                                            ></path>
                                        </svg>
                                        gadtc@gadtc.edu.ph
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/tcgcluxmundi"
                                        className="flex items-center gap-2"
                                        target="blank"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                fill="#039be5"
                                                d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                                            ></path>
                                        </svg>
                                        tcgcluxmundi
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
                                <p>The Torch Socials</p>
                            </div>
                            <ul className="text-white flex flex-col gap-2">
                                <li>
                                    <a
                                        href="mailto:thetorchpubpress@gmail.com"
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                fill="#1e88e5"
                                                d="M34,42H14c-4.411,0-8-3.589-8-8V14c0-4.411,3.589-8,8-8h20c4.411,0,8,3.589,8,8v20 C42,38.411,38.411,42,34,42z"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M35.926,17.488L29.414,24l6.511,6.511C35.969,30.347,36,30.178,36,30V18 C36,17.822,35.969,17.653,35.926,17.488z M26.688,23.899l7.824-7.825C34.347,16.031,34.178,16,34,16H14 c-0.178,0-0.347,0.031-0.512,0.074l7.824,7.825C22.795,25.38,25.205,25.38,26.688,23.899z M24,27.009 c-1.44,0-2.873-0.542-3.99-1.605l-6.522,6.522C13.653,31.969,13.822,32,14,32h20c0.178,0,0.347-0.031,0.512-0.074l-6.522-6.522 C26.873,26.467,25.44,27.009,24,27.009z M12.074,17.488C12.031,17.653,12,17.822,12,18v12c0,0.178,0.031,0.347,0.074,0.512 L18.586,24L12.074,17.488z"
                                            ></path>
                                        </svg>
                                        thetorchpubpress@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.facebook.com/TheTORCHofficialpage"
                                        className="flex items-center gap-2"
                                        target="blank"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                fill="#039be5"
                                                d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                                            ></path>
                                            <path
                                                fill="#fff"
                                                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                                            ></path>
                                        </svg>
                                        TheTORCHofficialpage
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
