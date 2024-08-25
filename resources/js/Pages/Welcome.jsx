import FeaturedArticle from "@/Components/FeaturedArticle";
import LatestArticles from "@/Components/LatestArticles";
import TopArticles from "@/Components/TopArticles";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";

export default function Welcome({
    auth,
    categories,
    featuredArticle,
    topArticles,
    latestArticles,
}) {
    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Featured article */}
                    <FeaturedArticle featuredArticle={featuredArticle} />

                    {/* Top Articles */}

                    <TopArticles topArticles={topArticles} />
                </div>

                <div className="w-full h-[2px] bg-violet-500 my-8"></div>

                <h5 className="block text-start font-sans text-2xl antialiased font-medium leading-snug tracking-normal text-violet-500">
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
