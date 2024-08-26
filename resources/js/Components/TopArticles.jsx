import { Link, router } from "@inertiajs/react";
import React from "react";

export default function TopArticles({ topArticles }) {
    
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
        <div className="w-full md:w-[35%] flex gap-4 flex-col">
            {topArticles.data.length > 0 ? (
                topArticles.data.map((article) => (
                    <div
                        key={article.id}
                        className="relative flex w-full flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg"
                    >
                        <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40 h-[300px] sm:h-[220px]">
                            <Link
                                href={route("article.read", article.id)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    incrementViews(article.id);
                                }}
                            >
                                <img
                                    src={article.article_image_path}
                                    className="w-full h-[300px] sm:h-[220px] object-cover"
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
                            <div className="p-6">
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
                                    {article.title.length > 100
                                        ? `${article.title.substring(
                                              0,
                                              100
                                          )}...`
                                        : article.title}
                                </Link>
                                <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                    By: {article.createdBy.name}
                                </p>
                                <p className="block mt-4 text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                    {article.body.length > 100
                                        ? `${article.body.substring(0, 100)}...`
                                        : article.body}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No top articles available.</p>
            )}
        </div>
    );
}
