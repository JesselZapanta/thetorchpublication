import TextInput from "@/Components/TextInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import { useState, useEffect } from "react";
import ArticleCard from "@/Components/ArticleCard";
import { Head } from "@inertiajs/react";

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
                            e.target.src = "/images/default/category.jpg";
                        }}
                        alt={currentCategory.name}
                    />
                    <p className="absolute font-semibold text-5xl dark:text-gray-200 leading-tight text-justify uppercase">
                        {currentCategory.name}
                    </p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center py-4 overflow-hidden flex gap-2">
                    <SelectInput
                        className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg"
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
                        className="w-full sm:w-2/3 p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                    {filteredArticles.length > 0 ? (
                        <div className="max-w-7xl py-2 mx-auto w-full grid lg:grid-cols-3 gap-4">
                            {filteredArticles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                />
                            ))}
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
