import React from 'react'
import { Link, router } from "@inertiajs/react";

export default function LatestArticles({ latestArticles }) {

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
        <>
            {latestArticles.data.length > 0 ? (
                latestArticles.data.map((article) => (
                    <div
                        key={article.id}
                        className="relative flex w-full flex-col md:flex-row rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg"
                    >
                        <div className="relative m-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40 h-[300px] sm:h-[220px]">
                            <Link
                                href={route("article.read", article.id)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    incrementViews(article.id);
                                }}
                            >
                                <img
                                    src={article.article_image_path}
                                    className="w-full md:w-[420px] h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/images/default/article.png";
                                    }}
                                    alt={article.title}
                                />
                            </Link>
                        </div>

                        <div className="flex flex-col w-full justify-between">
                            <div className="p-4 lg:pl-0">
                                <div className="flex items-center justify-between mb-3">
                                    <Link
                                        className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-indigo-500"
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
                                    {truncate(article.title, 100)}
                                </Link>
                                <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                    By: {article.createdBy.name}
                                </p>
                                <p className="block mt-2 text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                    {truncate(article.body, 100)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center w-full col-span-2">
                    <p className="text-gray-500 text-center">
                        No top articles available.
                    </p>
                </div>
            )}
        </>
    );
}
