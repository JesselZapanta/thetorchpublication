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


export default function About({
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
            <Head title="About Us Page" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 mt-16">
                    Hello
                    
                </div>

            </div>
        </UnauthenticatedLayout>
    );
}
