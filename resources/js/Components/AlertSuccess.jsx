import React, { useState, useEffect } from "react";

export default function AlertSuccess({ flash }) {
    const [flashMsg, setFlashMsg] = useState(null);
    const [visible, setVisible] = useState(false); // State to control visibility transition

    useEffect(() => {
        if (flash.success) {
            setFlashMsg(flash.success);
            setVisible(true); // Show the alert with a fade-in

            // Set a timeout to hide the message after 2 seconds
            const timer = setTimeout(() => {
                setVisible(false); // Start the fade-out
                // Delay removal of flash message after fade-out
                setTimeout(() => setFlashMsg(null), 300); // Allow transition to complete
            }, 2000);

            // Cleanup the timeout on component unmount
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!flashMsg) return null; // Don't render if no message

    return (
        <div
            className={`fixed bottom-12 right-12 z-20 bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-3 py-2 shadow-md transition-all duration-300 ease-in-out transform ${
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
            }`}
            role="alert"
        >
            <div className="flex">
                <div className="py-1">
                    <svg
                        className="fill-current h-6 w-6 text-teal-500 mr-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold">Success</p>
                    <p className="text-sm">{flashMsg}</p>
                </div>
            </div>
        </div>
    );
}