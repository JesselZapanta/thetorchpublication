import { useForm } from "@inertiajs/react";
import Rating from "@mui/material/Rating";
import React from "react";

export default function RatingComponent({ articleId, userRating }) {
    const { data, setData, post } = useForm({
        rating: userRating || null,
        article_id: articleId,
    });

    const handleRatingChange = (event, newValue) => {
        // Update local state with new rating
        setData("rating", newValue);

        // Post the updated rating to the server
        post(route("rate.article"), {
            // Pass additional data if needed
            preserveState: true,  // Optional: preserve form state
        });
    };

    return (
        <div>
            <h2>Rate this article:</h2>
            <Rating
                name="simple-controlled"
                value={data.rating}
                onChange={handleRatingChange}
                size="large"
            />
        </div>
    );
}
