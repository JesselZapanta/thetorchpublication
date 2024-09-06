import { Link, router } from "@inertiajs/react";
import React from "react";

export default function ArticleCard({ article }) {
    const incrementViews = () => {
        router.post(
            `/articles/${article.id}/increment-views`,
            {},
            {
                preserveScroll: true,
                // onSuccess: () => {
                //     router.visit(route("article.read", article.id));
                // },
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
        <div className="flex w-full flex-col">
            <div className="overflow-hidden rounded-xl h-64">
                <Link
                    href={route("article.read", article.id)}
                    onClick={(e) => {
                        e.preventDefault();
                        incrementViews();
                    }}
                >
                    <img
                        src={article.article_image_path}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default/article.png";
                        }}
                        alt={article.title}
                    />
                </Link>
            </div>
            <div className="flex items-center justify-between ">
                <Link
                    className="block mt-2 text-xl font-bold text-indigo-500"
                    href={route("articles.byCategory", article.category.id)}
                >
                    {article.category.name}
                </Link>
                {/* star */}
                <p className="text-amber-600 text-2xl">★</p>
            </div>
            <div className="text-gray-800 dark:text-gray-400 ">
                <Link
                    href={route("article.read", article.id)}
                    onClick={(e) => {
                        e.preventDefault();
                        incrementViews(article.id);
                    }}
                    className="block text-justify text-base font-bold mt-2"
                >
                    {truncate(article?.title, 50)}
                </Link>
                <p className="block text-sm text-justify mt-2">
                    By:
                    {article.is_anonymous === "yes"
                        ? " Anonymous"
                        : article.createdBy.name}
                </p>
                <p className="block text-sm text-justify">
                    Published Date: {article.published_date}
                </p>
                <p className="block mt-2 text-justify">
                    {truncate(article?.excerpt, 150)}
                </p>
            </div>
        </div>
    );
}
