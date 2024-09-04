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
                        className="relative flex w-full flex-col md:flex-row  dark:bg-gray-800"
                    >
                        <div className="overflow-hidden rounded-xl h-64">
                            <Link
                                href={route("article.read", article.id)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    incrementViews(article.id);
                                }}
                            >
                                <img
                                    src={article.article_image_path}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/images/default/article.png";
                                    }}
                                    alt={article.title}
                                />
                            </Link>
                        </div>

                        <div className="flex flex-col w-full ml-0 md:ml-2">
                            <div className="flex items-center justify-between">
                                <Link
                                    className="block mt-2 md:mt-0 text-xl font-bold text-indigo-500"
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
                                className="block text-justify text-base font-bold mt-2 md:mt-0"
                            >
                                {truncate(article.title, 40)}
                            </Link>
                            <p className="block text-sm text-justify mt-2">
                                By: {article.createdBy.name}
                            </p>
                            <p className="block text-sm text-justify">
                                Published Date: {article.published_date}
                            </p>
                            <p className="block mt-2 text-justify">
                                {truncate(article?.excerpt, 150)}
                            </p>
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
