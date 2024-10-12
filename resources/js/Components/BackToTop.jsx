import React, { useState, useEffect } from "react";

const BackToTop = () => {
    const [showButton, setShowButton] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll back to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed flex items-center gap-2 bottom-8 right-8 bg-indigo-600 text-white p-3 rounded shadow-lg hover:bg-indigo-500 transition"
                >
                    ↑<span className="hidden sm:block"> Back to Top</span>
                </button>
            )}
        </>
    );
};

export default BackToTop;
