import React from "react";

const ShareToX = () => {
    const currentUrl = window.location.href; // Get the current URL of the page
    const tweetText = "Check out this awesome article!"; // Optional custom text for tweet

    const handleShare = () => {
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl
        )}&text=${encodeURIComponent(tweetText)}`;
        window.open(twitterShareUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleShare}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
            Share on X (formerly Twitter)
        </button>
    );
};

export default ShareToX;
