import { Link, router } from '@inertiajs/react';
import React from 'react'

export default function FeaturedArticle({ featuredArticle }) {
    const incrementViews = (articleId) => {
        router.post(
            `/articles/${articleId}/increment-views`,
            {},
            {
                preserveScroll: true,
                // onSuccess: () => {
                //     router.visit(route("article.read", article.id))
                // }
            }
        );
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };


    return (
        <div className="w-full md:w-[65%] flex flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg">
            {featuredArticle ? (
                <>
                    <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40 h-[300px] sm:h-[600px]">
                        <Link
                            href={route("article.read", featuredArticle.id)}
                            onClick={(e) => {
                                e.preventDefault();
                                incrementViews(featuredArticle.id);
                            }}
                        >
                            <img
                                src={featuredArticle.article_image_path}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <Link
                                className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-indigo-500"
                                href={route(
                                    "articles.byCategory",
                                    featuredArticle.category.id
                                )}
                            >
                                {featuredArticle.category.name}
                            </Link>
                        </div>
                        <Link
                            href={route("article.read", featuredArticle.id)}
                            onClick={(e) => {
                                e.preventDefault();
                                incrementViews(featuredArticle.id);
                            }}
                            className="block text-justify font-sans text-lg antialiased font-medium leading-snug tracking-normal text-gray-100"
                        >
                            {truncate(featuredArticle?.title, 150)}
                        </Link>
                        <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                            By: {featuredArticle.createdBy.name}
                        </p>
                        <p className="block mt-4 text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                            {truncate(featuredArticle?.body, 500)}
                        </p>
                    </div>
                </>
            ) : (
                <p>No featured article available.</p>
            )}
        </div>
    );
}
