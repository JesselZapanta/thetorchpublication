import ArticleCard from "@/Components/ArticleCard";
import ArticlePagination from "@/Components/ArticlePagination";
import SearchInput from "@/Components/SearchInput";
import SelectInput from "@/Components/SelectInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, router } from "@inertiajs/react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

export default function Publication({ auth, categories, publications }) {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);

    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");

    // for sorting
    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setCategory(selectedValue);

        router.get(
            route("home.publication"),
            {
                category: selectedValue,
                search,
            },
            {
                preserveState: true,
            }
        );
    };

    // for sorting
    const handleSortChange = (e) => {
        const selectedValue = e.target.value;
        setSort(selectedValue);

        router.get(
            route("home.publication"),
            {
                sort: selectedValue,
                search,
            },
            {
                preserveState: true,
            }
        );
    };

    // Search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value === "") {
            router.get(
                route("home.publication"),
                {
                    sort,
                    search: value,
                },
                {
                    preserveState: true,
                }
            );
        }
    };
    // Search on Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            // Check for the correct key
            e.preventDefault();
            router.get(
                route("home.publication"),
                {
                    sort,
                    search, // Trigger search with current search state
                },
                {
                    preserveState: true,
                }
            );
        }
    };

    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <Head title="Newsletter Page" />

            <div className="w-full mx-auto text-center">
                <div className="w-full h-[200px] sm:h-[350px] overflow-hidden bg-gray-600 flex items-center justify-center relative pt-16">
                    <img
                        src="/images/default/category.png"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onError = null;
                            e.target.src = "/images/default/category.png";
                        }}
                    />
                    <p className="absolute font-semibold sm:txt-md md:text-5xl text-gray-50 dark:text-gray-200 leading-tight text-justify uppercase">
                        Publications
                    </p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center py-4 overflow-hidden gap-2">
                    <div className="grid grid-cols-4 gap-2">
                        <div className="w-full">
                            <SelectInput
                                className="w-full"
                                value={category}
                                onChange={handleCategoryChange} // Handle the change
                            >
                                <option value="">All Publications</option>
                                <option value="newsletter">Newsletter</option>
                                <option value="folio">Folio</option>
                                <option value="tabloid">Tabloid</option>
                            </SelectInput>
                        </div>
                        <div className="w-full">
                            <SelectInput
                                className="w-full"
                                value={sort}
                                onChange={handleSortChange} // Handle the change
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
                                placeholder="Search publications..."
                                value={search}
                                onChange={handleSearchChange}
                                onKeyPress={handleKeyPress}
                                className="w-full"
                                queryParams={{ sort, search }}
                                route={route("home.publication")}
                            />
                        </div>
                    </div>
                </div>
                <p></p>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                    {publications.data.length > 0 ? (
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {publications.data.map((publication) => (
                                <div data-aos="fade-up">
                                    <div className="overflow-hidden rounded-xl h-96 shadow-lg">
                                        <a
                                            href={
                                                publication.publication_file_path
                                            }
                                            target="blank"
                                        >
                                            <img
                                                src={
                                                    publication.publication_thumbnail_image_path
                                                }
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/images/default/article.png";
                                                }}
                                                alt={publication.description}
                                            />
                                        </a>
                                    </div>
                                    <div>
                                        <p className="block mt-2 text-center">
                                            {truncate(
                                                publication?.description,
                                                40
                                            )}
                                        </p>
                                        {publication?.category && (
                                            <p className="block italic uppercase text-center">
                                                (
                                                {truncate(
                                                    publication.category,
                                                    40
                                                )}
                                                )
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center">
                            No publications found.
                        </p>
                    )}
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
