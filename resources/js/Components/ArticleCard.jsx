import { Link } from "@inertiajs/react";
import React from "react";

export default function ArticleCard({article}) {
    return (
        <div className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg">
            <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40 h-64">
                <Link href={route("article.read", article.id)}>
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
            <div className="flex flex-col w-full justify-between">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <Link
                            href={route("article.read", article.id)}
                            className="block text-justify font-sans text-lg antialiased font-medium leading-snug tracking-normal text-gray-100"
                        >
                            {article.title.length > 150
                                ? `${article.title.substring(0, 150)}...`
                                : article.title}
                        </Link>
                    </div>
                    <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                        By: {article.createdBy.name}
                    </p>
                </div>
            </div>
        </div>
    );
}
