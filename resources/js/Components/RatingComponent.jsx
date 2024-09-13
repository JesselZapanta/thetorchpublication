import axios from "axios";
import React, { useState, useEffect } from "react";

export default function RatingComponent({ articleId, isAuthenticated }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userHasRated, setUserHasRated] = useState(false);
    const [totalRatings, setTotalRatings] = useState(0);
    const [userRating, setUserRating] = useState("None");

    // color variables
    const colors = {
        hoverColor: "gold",
        ratedColor: "green",
        averageColor: "blue",
        unauthenticatedColor: "indigo",
        defaultColor: "gray",
    };

    // Function to fetch and update ratings
    const fetchAndUpdateRatings = async () => {
        const response = await axios.get(`/get-article-ratings/${articleId}`);
        const { avgRating, totalRatings, userRating } = response.data;

        setAverageRating(Math.round(avgRating) || 0);
        setTotalRatings(totalRatings || 0);
        setUserRating(userRating || "None");
        setUserHasRated(userRating !== "None");
    };

    // Fetch ratings when the component mounts
    useEffect(() => {
        fetchAndUpdateRatings();
    }, [articleId]);

    const handleRatingClick = async (star) => {
        if (!isAuthenticated) return;

        await axios.post("/rate-article", {
            article_id: articleId,
            rating: star,
        });

        // Update local state
        setRating(star);
        setUserHasRated(true);

        // Fetch updated ratings immediately
        fetchAndUpdateRatings();
    };

    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="star"
                    style={{
                        cursor: isAuthenticated ? "pointer" : "not-allowed",
                        color: isAuthenticated
                            ? hoverRating >= star
                                ? colors.hoverColor
                                : userHasRated
                                ? averageRating >= star
                                    ? colors.ratedColor
                                    : colors.defaultColor
                                : averageRating >= star
                                ? colors.averageColor
                                : colors.defaultColor
                            : averageRating >= star
                            ? colors.unauthenticatedColor
                            : colors.defaultColor,
                        fontSize: "35px",
                        transition: "color 0.3s ease",
                    }}
                    onClick={() => isAuthenticated && handleRatingClick(star)}
                    onMouseEnter={() => isAuthenticated && setHoverRating(star)}
                    onMouseLeave={() => isAuthenticated && setHoverRating(0)}
                >
                    ★
                </span>
            ))}
            <div>Average Rating: {averageRating} / 5</div>
            <div>Total Ratings: {totalRatings}</div>
            {isAuthenticated && userHasRated && (
                <div>Your Rating: {userRating}</div>
            )}
        </div>
    );
}
