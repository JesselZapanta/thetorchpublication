import { Link, router } from '@inertiajs/react';
import React from 'react'


import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


export default function FeaturedArticle({ featuredArticle }) {
    const incrementViews = (slug) => {
        router.post(
            `/articles/${slug}/increment-views`,
            {},
            {
                preserveScroll: true,
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


    
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);


    return (
        <div className="w-full md:w-[65%] flex flex-col" data-aos="fade-up">
            {/* <pre className="text-gray-950">
                {JSON.stringify(featuredArticle.slug, null, 2)}
            </pre> */}

            <div className="relative overflow-hidden rounded-xl h-[300px] sm:h-[600px]">
                <Link
                    href={route("article.read", featuredArticle.slug)}
                    onClick={(e) => {
                        e.preventDefault();
                        incrementViews(featuredArticle.slug);
                    }}
                >
                    <img
                        src={featuredArticle.article_image_path}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default/article.png";
                        }}
                    />
                </Link>
            </div>
            <div className="flex items-center justify-between ">
                <Link
                    className="block mt-2 text-xl font-bold text-indigo-500"
                    href={route(
                        "articles.byCategory",
                        featuredArticle.category.id
                    )}
                >
                    {featuredArticle.category.name}
                </Link>
                {/* star */}
                <div className="flex justify-center items-center gap-1">
                    <p className="text-gray-800 text-md">
                        {featuredArticle.average_rating}
                    </p>
                    <p className="text-amber-600 text-2xl">★</p>
                </div>
            </div>
            <div className="text-gray-800 dark:text-gray-400 ">
                <Link
                    href={route("article.read", featuredArticle.slug)}
                    onClick={(e) => {
                        e.preventDefault();
                        incrementViews(featuredArticle.slug);
                    }}
                    className="block text-justify mt-2 text-xl font-bold"
                >
                    {truncate(featuredArticle?.title, 150)}
                </Link>
                <p className="block text-sm mt-2 text-justify">
                    By:
                    {featuredArticle.author
                        ? featuredArticle.author
                        : featuredArticle.is_anonymous === "yes"
                        ? "Anonymous"
                        : featuredArticle.createdBy.name}
                </p>

                <p className="block text-sm text-justify">
                    Published Date: {featuredArticle.published_date}
                </p>
                <p className="block mt-2 text-justify">
                    {truncate(featuredArticle?.excerpt, 500)}
                </p>
            </div>
        </div>
    );
}
