import TextInput from "@/Components/TextInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function ByCategory({
    auth,
    categories,
    categoryarticles,
    currentCategory,
}) {
    const [search, setSearch] = useState("");
    const [filteredArticles, setFilteredArticles] = useState(
        categoryarticles.data
    );
    const [sort, setSort] = useState("");

    useEffect(() => {
        handleSearch();
    }, [search, sort]);

    const handleSearch = () => {
        let filtered = categoryarticles.data.filter((article) =>
            article.title.toLowerCase().includes(search.toLowerCase())
        );

        if (sort === "date_asc") {
            filtered.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        } else if (sort === "date_desc") {
            filtered.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        } else if (sort === "title_asc") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === "title_desc") {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredArticles(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <div className="w-full mx-auto text-center">
                <div className="w-full h-64 overflow-hidden bg-gray-600 flex items-center justify-center relative">
                    <img
                        src={currentCategory.category_image_path}
                        className="w-full h-full object-cover"
                    />
                    <p className="absolute font-semibold text-5xl dark:text-gray-200 leading-tight text-justify uppercase">
                        {currentCategory.name}
                    </p>
                </div>

                <div className="max-w-7xl py-12 flex mx-auto">
                    <SelectInput
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort by</option>
                        <option value="date_asc">Date: Ascending</option>
                        <option value="date_desc">Date: Descending</option>
                        <option value="title_asc">Title: A-Z</option>
                        <option value="title_desc">Title: Z-A</option>
                    </SelectInput>
                    <TextInput
                        type="text"
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {filteredArticles.length > 0 ? (
                    <div className="max-w-7xl py-12 mx-auto grid grid-cols-3 gap-2">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg"
                            >
                                <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40 h-64">
                                    <img
                                        src={article.article_image_path}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col w-full justify-between">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <Link
                                                href={route(
                                                    "article.read",
                                                    article.id
                                                )}
                                                className="block text-justify font-sans text-lg antialiased font-medium leading-snug tracking-normal text-gray-100"
                                            >
                                                {article.title.length > 150
                                                    ? `${article.title.substring(
                                                          0,
                                                          150
                                                      )}...`
                                                    : article.title}
                                            </Link>
                                        </div>
                                        <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                            By: {article.createdBy.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">
                        No articles found.
                    </p>
                )}
            </div>
        </UnauthenticatedLayout>
    );
}
