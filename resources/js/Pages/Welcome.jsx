import ArticleCard from "@/Components/ArticleCard";
import FeaturedArticle from "@/Components/FeaturedArticle";
import LatestArticles from "@/Components/LatestArticles";
import NewsletterCard from "@/Components/NewsletterCard";
import TopArticles from "@/Components/TopArticles";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


export default function Welcome({
    auth,
    categories,
    featuredArticle,
    topArticles,
    latestArticles,
    latestNewsletter,
}) {

    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);


    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <Head title="Home Page" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 mt-16">
                    {/* Featured article */}
                    {featuredArticle ? (
                        <FeaturedArticle featuredArticle={featuredArticle} />
                    ) : (
                        <p className="text-center">No featured article.</p>
                    )}

                    {/* Top Articles */}
                    <div className="w-full md:w-[35%] flex gap-4 flex-col">
                        {topArticles.data.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                        {topArticles.data.length === 0 && (
                            <p className="text-center">No top articles.</p>
                        )}
                    </div>
                </div>

                <div
                    className="w-full h-[2px] bg-indigo-500 mt-2"
                    data-aos="fade-up"
                ></div>

                <h5
                    className="block text-start  text-2xl text-indigo-500 py-2"
                    data-aos="fade-up"
                >
                    The Latest
                </h5>

                <div
                    className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    data-aos="fade-up"
                >
                    {/* <LatestArticles latestArticles={latestArticles} /> */}
                    {latestArticles.data.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                    {latestArticles.data.length === 0 && (
                        <p className="text-center">No latest articles.</p>
                    )}
                </div>

                <div
                    className="w-full h-[2px] bg-indigo-500 mt-2"
                    data-aos="fade-up"
                ></div>

                <h5
                    className="block text-start  text-2xl text-indigo-500 py-2"
                    data-aos="fade-up"
                >
                    Latest Release
                </h5>

                <div data-aos="fade-up">
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* <LatestArticles latestArticles={latestArticles} /> */}
                        {latestNewsletter.data.map((newsletter) => (
                            <NewsletterCard
                                key={newsletter.id}
                                newsletter={newsletter}
                            />
                        ))}
                    </div>
                    {latestNewsletter.data.length === 0 && (
                        <p className="text-center">No latest release</p>
                    )}
                </div>

                {/* <pre className="text-gray-900">
                    {JSON.stringify(featuredArticle, null, 2)}
                </pre> */}
                
            </div>
        </UnauthenticatedLayout>
    );
}
