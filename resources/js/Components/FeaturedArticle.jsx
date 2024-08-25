import { Link, router } from '@inertiajs/react';
import React from 'react'

export default function FeaturedArticle({ featuredArticle }) {
    // Extract the data array from featuredArticle
    const article = featuredArticle?.data?.[0] || null;

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


    return (
        <div className="w-full md:w-[65%] flex flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg">
            {article ? (
                <>
                    <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40">
                        <Link
                            href={route("article.read", article.id)}
                            onClick={(e) => {
                                e.preventDefault();
                                incrementViews(article.id);
                            }}
                        >
                            <img
                                src={article.article_image_path}
                                alt={article.title}
                                className="w-full h-auto"
                            />
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <Link
                                className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-violet-500"
                                href={route(
                                    "articles.byCategory",
                                    article.category.id
                                )}
                            >
                                {article.category.name}
                            </Link>
                        </div>
                        <Link
                            href={route("article.read", article.id)}
                            onClick={(e) => {
                                e.preventDefault();
                                incrementViews(article.id);
                            }}
                            className="block text-justify font-sans text-lg antialiased font-medium leading-snug tracking-normal text-gray-100"
                        >
                            {article.title.length > 150
                                ? `${article.title.substring(0, 150)}...`
                                : article.title}
                        </Link>
                        <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                            By: {article.createdBy.name}
                        </p>
                        <p className="block mt-4 text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                            {article.body.length > 800
                                ? `${article.body.substring(0, 800)}...`
                                : article.body}
                        </p>
                    </div>
                </>
            ) : (
                <p>No featured article available.</p>
            )}
        </div>
    );
}
