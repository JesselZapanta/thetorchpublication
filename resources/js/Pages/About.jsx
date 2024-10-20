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


export default function About({ auth, categories, admins, members, activeAy }) {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);

    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <Head title="About Us Page" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(activeAy, null, 2)}
            </pre> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div
                    data-aos="fade-up"
                    className="flex flex-col md:flex-row gap-4 mt-16"
                >
                    <img
                        src="/images/about.png"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h2
                        data-aos="fade-up"
                        className="text-center font-bold text-2xl text-emerald-950 mt-4"
                    >
                        About Us
                    </h2>
                    <p data-aos="fade-up" className="text-justify py-4">
                        The Torch Publication is the official student
                        publication of Tangub City Global College, and acts as a
                        vibrant hub of information and creative expression for
                        its students. Functioning as a beacon, it disseminates
                        college news and events through its diverse
                        publications. Monthly newsletters keep students informed
                        of the latest happenings, while semestral tabloids offer
                        in-depth exploration of stories and issues relevant to
                        the college community. Additionally, the Torch
                        Publication fosters creativity by providing a platform
                        for students to showcase their literary talents through
                        literary folios. More than just a source of information,
                        it lives up to its tagline,{" "}
                        <span className="font-bold">
                            "Uplifting the truth, enlightening the minds,"
                        </span>{" "}
                        and empowers student voices and fosters a vibrant
                        creative space within Tangub City Global College.
                    </p>
                </div>
                {/* mission vision */}
                <div
                    data-aos="fade-up"
                    className="flex gap-4 flex-col md:flex-row "
                >
                    <div>
                        <h2
                            data-aos="fade-up"
                            className="text-center font-bold text-2xl text-emerald-950 mt-4"
                        >
                            Mission
                        </h2>
                        <p data-aos="fade-up" className="text-justify py-4">
                            To provide a platform for students to share
                            perspectives, disseminate information, and
                            participate in intellectual discourse, while
                            maintaining the highest standards of integrity,
                            excellence, and social responsibility, effectively
                            capturing the diverse voices of the TCGC community.
                        </p>
                    </div>
                    <div>
                        <h2
                            data-aos="fade-up"
                            className="text-center font-bold text-2xl text-emerald-950 mt-4"
                        >
                            Vision
                        </h2>
                        <p data-aos="fade-up" className="text-justify py-4">
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
                <div data-aos="fade-up">
                    <h2 className="text-center font-bold text-2xl text-emerald-950 mt-4">
                        Goals
                    </h2>
                    <div className="mx-auto max-w-xl">
                        <div data-aos="fade-up" className="flex gap-4 py-4">
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
                        <div data-aos="fade-up" className="flex gap-4 py-4">
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
                        <div data-aos="fade-up" className="flex gap-4 py-4">
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
                <h2
                    data-aos="fade-up"
                    className="text-center font-bold text-2xl text-emerald-950 mt-4"
                >
                    Editorial Board
                </h2>
                <p
                    data-aos="fade-up"
                    className="text-center font-bold text-md text-emerald-950"
                >
                    {activeAy && activeAy.description}
                </p>
                {/* admins */}
                <div data-aos="fade-up" className="max-w-3xl mx-auto ">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2  py-6 mx-auto">
                        {/* user */}
                        {admins.data.length < 0 && (
                            <p className="col-span-2">No data available.</p>
                        )}
                        {admins.data.map((admin) => (
                            <div
                                data-aos="fade-up"
                                className="flex flex-col justify-center items-center"
                            >
                                <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                    {admin.member_image_path && (
                                        <img
                                            src={admin.member_image_path}
                                            className="object-cover w-full h-full"
                                            alt={admin.member_image_path}
                                        />
                                    )}
                                </div>
                                <div className=" mt-2">
                                    <p className="text-center font-bold text-md text-emerald-950">
                                        {admin.name}
                                    </p>
                                    <p className="text-center font-bold text-sm text-emerald-950">
                                        {admin.position}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <h2
                    data-aos="fade-up"
                    className="text-center font-bold text-2xl text-emerald-950 mt-4"
                >
                    Members
                </h2>

                {/* Members */}
                <div className="mx-auto max-w-3xl">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 py-6 mx-auto">
                        {members.data.length < 0 && (
                            <p className="col-span-2">No data available.</p>
                        )}
                        {members.data.map((member) => (
                            <div
                                data-aos="fade-up"
                                className="flex flex-col justify-center items-center"
                            >
                                <div className="rounded-full overflow-hidden w-52 h-52 border-2 border-indigo-500">
                                    {member.member_image_path && (
                                        <img
                                            src={member.member_image_path}
                                            className="object-cover w-full h-full"
                                            alt={member.member_image_path}
                                        />
                                    )}
                                </div>
                                <div className=" mt-2">
                                    <p className="text-center font-bold text-md text-emerald-950">
                                        {member.name}
                                    </p>
                                    <p className="text-center font-bold text-sm text-emerald-950">
                                        {member.position}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
