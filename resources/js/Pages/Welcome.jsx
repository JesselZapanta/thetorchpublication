import ArticleCard from "@/Components/ArticleCard";
import FeaturedArticle from "@/Components/FeaturedArticle";
import LatestArticles from "@/Components/LatestArticles";
import TopArticles from "@/Components/TopArticles";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Welcome({
    auth,
    categories,
    featuredArticle,
    topArticles,
    latestArticles,
}) {
    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <Head title="Home Page" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 mt-16">
                    {/* Featured article */}
                    <FeaturedArticle featuredArticle={featuredArticle} />

                    {/* Top Articles */}
                    <div className="w-full md:w-[35%] flex gap-4 flex-col">
                        {topArticles.data.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>

                <div className="w-full h-[2px] bg-indigo-500 my-8"></div>

                <h5 className="block text-start font-sans text-2xl antialiased font-medium leading-snug tracking-normal text-indigo-500">
                    The Latest
                </h5>

                <div className="w-full grid lg:grid-cols-2 gap-4 mt-8">
                    <LatestArticles latestArticles={latestArticles} />
                </div>

                {/* <pre className="text-white">
                    {JSON.stringify(latestArticles, null, 2)}
                </pre> */}
            </div>
        </UnauthenticatedLayout>
    );
}
