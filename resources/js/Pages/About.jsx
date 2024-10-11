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
                    <img
                        src="/images/about.jpg"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                        About Us
                    </h2>
                    <p className="text-justify py-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Possimus expedita magnam nisi ad fugit doloribus
                        vel hic similique sint ducimus aliquid unde sunt
                        molestiae, deserunt laudantium, facere inventore
                        quibusdam facilis sapiente magni nam? Tempore asperiores
                        hic ipsam! Voluptas eius accusantium alias modi
                        recusandae eos tempora soluta? Ea incidunt magni non.
                    </p>
                </div>
                {/* mission vision */}
                <div className="flex gap-4 flex-col md:flex-row ">
                    <div>
                        <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                            Mission
                        </h2>
                        <p className="text-justify py-4">
                            To provide a platform for students to share
                            perspectives, disseminate information, and
                            participate in intellectual discourse, while
                            maintaining the highest standards of integrity,
                            excellence, and social responsibility, effectively
                            capturing the diverse voices of the TCGC community.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                            Vision
                        </h2>
                        <p className="text-justify py-4">
                            To be a leading student publication that stands for
                            the principles of press freedom, ethical journalism,
                            and responsible reporting, with the goal of
                            empowering students to make valuable contributions
                            to the academic community and society, while also
                            fostering commitment to truth and fairness.
                        </p>
                    </div>
                </div>
                {/* goals */}
                <div className="">
                    <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                        Goals
                    </h2>
                    <div className="mx-auto max-w-xl">
                        <div className="flex gap-4 py-4">
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold text-gray-50 rounded-full bg-emerald-950">
                                1
                            </div>
                            <p className="text-justify">
                                Promote Ethical Journalism. Ensure that all
                                content meets the highest standards of integrity
                                and responsibility, demonstrating a commitment
                                to truth and fairness while addressing relevant
                                societal concerns.
                            </p>
                        </div>
                        <div className="flex gap-4 py-4">
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold text-gray-50 rounded-full bg-emerald-950">
                                2
                            </div>
                            <p className="text-justify">
                                Empower Student Voices. Provide students with a
                                variety of opportunities to express themselves,
                                participate in intellectual discourse, and
                                interact with the academic and community at
                                large.
                            </p>
                        </div>
                        <div className="flex gap-4 py-4">
                            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-lg font-bold text-gray-50 rounded-full bg-emerald-950">
                                2
                            </div>
                            <p className="text-justify">
                                Foster Lifelong Learning. Encourage students'
                                critical thinking and continuous learning by
                                offering well-researched and thought-provoking
                                content that contributes to their personal and
                                academic growth.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Editorial Board */}
                <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                    Editorial Board
                </h2>
                <p className="text-center font-bold text-md text-emerald-950">
                    A.Y. 2024 - 2025
                </p>
                {/* admins */}
                <div className="max-w-3xl mx-auto ">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2  py-6 mx-auto">
                        {/* user */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                <img src="/images/default/profile.jpg" />
                            </div>
                            <div className=" mt-2">
                                <p className="text-center font-bold text-md text-emerald-950">
                                    Jessel Zapanta
                                </p>
                                <p className="text-center font-bold text-sm text-emerald-950">
                                    ADVISER
                                </p>
                            </div>
                        </div>
                        {/* user */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                <img src="/images/default/profile.jpg" />
                            </div>
                            <div className=" mt-2">
                                <p className="text-center font-bold text-md text-emerald-950">
                                    Jessel Zapanta
                                </p>
                                <p className="text-center font-bold text-sm text-emerald-950">
                                    ADVISER
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                    Members
                </h2>
                {/* Editors */}
                <div className="mx-auto max-w-3xl">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 py-6 mx-auto">
                        {/* user */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                <img src="/images/default/profile.jpg" />
                            </div>
                            <div className=" mt-2">
                                <p className="text-center font-bold text-md text-emerald-950">
                                    Jessel Zapanta
                                </p>
                                <p className="text-center font-bold text-sm text-emerald-950">
                                    ADVISER
                                </p>
                            </div>
                        </div>
                        {/* user */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                <img src="/images/default/profile.jpg" />
                            </div>
                            <div className=" mt-2">
                                <p className="text-center font-bold text-md text-emerald-950">
                                    Jessel Zapanta
                                </p>
                                <p className="text-center font-bold text-sm text-emerald-950">
                                    ADVISER
                                </p>
                            </div>
                        </div>
                        {/* user */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                <img src="/images/default/profile.jpg" />
                            </div>
                            <div className=" mt-2">
                                <p className="text-center font-bold text-md text-emerald-950">
                                    Jessel Zapanta
                                </p>
                                <p className="text-center font-bold text-sm text-emerald-950">
                                    ADVISER
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
