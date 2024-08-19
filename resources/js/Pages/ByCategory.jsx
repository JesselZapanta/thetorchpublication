
import NavLink from "@/Components/NavLink";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Link } from "@inertiajs/react";
import { stringify } from "qs";

export default function ByCategory({ auth, categories, categoryarticles, currentCategory }) {
    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <div className="w-full mx-auto text-center">
                <div className="w-full h-64 overflow-hidden bg-gray-600 flex items-center justify-center">
                    <img
                        src={currentCategory.category_image_path}
                        className="w-full h-full object-cover"
                    />
                    <p className="absolute font-semibold text-5xl dark:text-gray-200 leading-tight text-justify uppercase">
                        {currentCategory.name}
                    </p>
                </div>
                {/* <pre className="text-white">
                    {JSON.stringify(categoryarticles, undefined, 2)}
                </pre> */}
                <div className="max-w-7xl py-12 mx-auto grid grid-cols-3 gap-2">
                    {categoryarticles.data.map((article) => (
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
                                {/* <div className="p-6 pt-3">
                                    <Link
                                        className="block w-full select-none rounded-lg bg-gray-900 py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-gray-100 shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        href={route("article.read", article.id)}
                                    >
                                        Read
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
