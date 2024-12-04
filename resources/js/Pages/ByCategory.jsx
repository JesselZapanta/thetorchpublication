import TextInput from "@/Components/TextInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import { useState, useEffect } from "react";
import ArticleCard from "@/Components/ArticleCard";
import { Head, router } from "@inertiajs/react";
import ArticlePagination from "@/Components/ArticlePagination";
import SearchInput from "@/Components/SearchInput";

export default function ByCategory({
    auth,
    categories,
    categoryarticles,
    currentCategory,
}) {

    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");

    // for sorting
    const handleSortChange = (e) => {
        const selectedValue = e.target.value;
        setSort(selectedValue);

        router.get(
            route("articles.byCategory", { slug: currentCategory.slug }),
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
                route("articles.byCategory", { slug: currentCategory.slug }),
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
                route("articles.byCategory", { slug: currentCategory.slug }),
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

    return (
        <UnauthenticatedLayout
            user={auth.user}
            categories={categories}
            // header={
            //     <div className="max-w-7xl mx-auto flex items-center justify-between">
            //         <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
            //             {currentCategory.name}
            //         </h2>
            //     </div>
            // }
        >
            <Head title={currentCategory.name} />
            <div className="w-full mx-auto text-center">
                <div className="w-full h-[200px] sm:h-[350px] overflow-hidden bg-gray-600 flex items-center justify-center relative pt-16">
                    <img
                        src={currentCategory.category_image_path}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onError = null;
                            e.target.src = "/images/default/category.png";
                        }}
                        alt={currentCategory.name}
                    />
                    <p className="absolute font-semibold sm:txt-md md:text-5xl text-gray-50 dark:text-gray-200 leading-tight text-justify uppercase">
                        {currentCategory.name}
                    </p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center py-4 overflow-hidden gap-2">
                    <div className="grid grid-cols-3 gap-2">
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

                                <option value="title_desc">Title: Z-A</option>
                                <option value="title_asc">Title: A-Z</option>

                                <option value="views_desc">
                                    Views: Descending
                                </option>
                                <option value="views_asc">
                                    Views: Ascending
                                </option>

                                <option value="ratings_desc">
                                    Ratings: Descending(5 - 0)
                                </option>
                                <option value="ratings_asc">
                                    Ratings: Ascending(0 - 5)
                                </option>

                                <option value="30_days_desc">
                                    30 Days Ago
                                </option>
                                <option value="60_days_desc">
                                    60 Days Ago
                                </option>
                                <option value="90_days_desc">
                                    90 Days Ago
                                </option>
                            </SelectInput>
                        </div>
                        <div className="w-full col-span-2">
                            <SearchInput
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={handleSearchChange} 
                                onKeyPress={handleKeyPress} 
                                className="w-full"
                                queryParams={{ sort, search }} 
                                route={route("articles.byCategory", {
                                    slug: currentCategory.slug,
                                })}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                    {/* <pre className="text-white">
                        {JSON.stringify(categoryarticles, null, 2)}
                    </pre> */}
                    {categoryarticles.data.length > 0 ? (
                        <div>
                            <div className="max-w-7xl py-2 mx-auto w-full grid lg:grid-cols-3 gap-4">
                                {categoryarticles.data.map((article) => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                    />
                                ))}
                            </div>
                            <ArticlePagination
                                links={categoryarticles.meta.links}
                                queryParams={{
                                    sort: sort,
                                    search: search,
                                }}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center">
                            No articles found.
                        </p>
                    )}
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
