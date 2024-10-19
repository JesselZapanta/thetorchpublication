import React from "react";
import {
    PencilSquareIcon,
    TrashIcon,
    ListBulletIcon,
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

const ShareToFacebook = () => {
    const currentUrl = window.location.href; // Get the current URL of the page

    const handleShare = () => {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
        )}`;
        window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleShare}
            className="flex gap-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
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
            Share
        </button>
    );
};

export default ShareToFacebook;