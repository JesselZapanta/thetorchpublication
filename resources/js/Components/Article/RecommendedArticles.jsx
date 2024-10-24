import { Link, router } from "@inertiajs/react";
import React from "react";

const RecommendedArticles = ({ recommendedArticles }) => {
    const incrementViews = (slug) => {
        router.post(`/articles/${slug}/increment-views`);
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    return (
        <div className="flex gap-4 mt-2">
            {/* <pre className="text-gray-900">
                {JSON.stringify(recommendedArticles, null, 2)}
            </pre> */}
            {recommendedArticles.data.map((article) => (
                <div key={article.id} className="flex-shrink-0">
                    {/* Add flex-shrink-0 to prevent shrinking */}
                    <div className="h-20 w-52">
                        <Link
                            href={route("article.read", article.slug)}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default link behavior
                                incrementViews(article.slug); // Pass the current article's ID
                            }}
                        >
                            <img
                                src={article.article_image_path}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop on error
                                    e.target.src =
                                        "/images/default/article.png"; // Fallback image
                                }}
                                alt={article.title}
                            />
                        </Link>
                    </div>
                    <p className="block mt-2 text-sm text-justify">
                        {truncate(article?.title, 15)}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default RecommendedArticles;
