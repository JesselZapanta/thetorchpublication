import ArticleCard from "@/Components/ArticleCard";
import ArticlePagination from "@/Components/ArticlePagination";
import SearchInput from "@/Components/SearchInput";
import SelectInput from "@/Components/SelectInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Newsletter({ auth, categories , newsletters }) {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);

    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <Head title="Home Page" />

            <div className="w-full mx-auto text-center">
                <div className="w-full h-[200px] sm:h-[350px] overflow-hidden bg-gray-600 flex items-center justify-center relative pt-16">
                    <img
                        src="/images/default/category.png"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onError = null;
                            e.target.src = "/images/default/category.png";
                        }}
                        // alt={currentCategory.name}
                    />
                    <p className="absolute font-semibold sm:txt-md md:text-5xl text-gray-50 dark:text-gray-200 leading-tight text-justify uppercase">
                        Newsletter
                    </p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center py-4 overflow-hidden gap-2">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="w-full">
                            <SelectInput
                                className="w-full"
                                // value={sort}
                                // onChange={handleSortChange} // Handle the change
                            >
                                <option value="date_desc">
                                    Date: Descending
                                </option>
                                <option value="date_asc">
                                    Date: Ascending
                                </option>
                            </SelectInput>
                        </div>
                        <div className="w-full col-span-2">
                            <SearchInput
                                type="text"
                                // placeholder="Search articles..."
                                // value={search}
                                // onChange={handleSearchChange}
                                // onKeyPress={handleKeyPress}
                                className="w-full"
                                // queryParams={{ sort, search }}
                                // route={route("articles.byCategory", {
                                //     slug: currentCategory.slug,
                                // })}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newsletters.data.map((newsletter) => (
                            <div data-aos="fade-up">
                                <div className="overflow-hidden rounded-xl h-96 shadow-lg">
                                    <a
                                        href={newsletter.newsletter_file_path}
                                        target="blank"
                                    >
                                        <img
                                            src={
                                                newsletter.newsletter_thumbnail_image_path
                                            }
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/images/default/article.png";
                                            }}
                                            alt={newsletter.description}
                                        />
                                    </a>
                                </div>
                                <p className="block mt-2 text-center">
                                    {truncate(newsletter?.description, 40)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {newsletters.data.map((newsletter) => (
                        <div data-aos="fade-up">
                            <div className="overflow-hidden rounded-xl h-96 shadow-lg">
                                <a
                                    href={newsletter.newsletter_file_path}
                                    target="blank"
                                >
                                    <img
                                        src={
                                            newsletter.newsletter_thumbnail_image_path
                                        }
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/images/default/article.png"; 
                                        }}
                                        alt={newsletter.description}
                                    />
                                </a>
                            </div>
                            <p className="block mt-2 text-center">
                                {truncate(newsletter?.description, 40)}
                            </p>
                        </div>
                    ))}
                </div>
            </div> */}
        </UnauthenticatedLayout>
    );
}
