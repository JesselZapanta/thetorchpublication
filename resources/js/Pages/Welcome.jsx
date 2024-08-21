import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { stringify } from "qs";

export default function Welcome({ auth, categories }) {
    return (
        <UnauthenticatedLayout user={auth.user} categories={categories}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Welcome to the TORCH Publication Website
                </h1>
                <p className="text-center text-xl">The Oficial Publication of Tangub City Global College</p>
                {/* <pre className="text-white">
                    {JSON.stringify(categoryarticles, undefined, 2)}
                </pre> */}
                {/* <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2">
                    {categoryarticles.data.map((article) => (
                        <div className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg">
                            <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-gray-700 bg-clip-border shadow-gray-900/40">
                                <img
                                    src={article.article_image_path}
                                    alt=""
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-gray-100">
                                        {article.category.name}
                                    </h5>
                                </div>
                                <p className="block text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                                    {article.title}
                                </p>
                            </div>
                            <div className="p-6 pt-3">
                                <button
                                    className="block w-full select-none rounded-lg bg-gray-900 py-3.5 px-7 text-center align-middle font-sans text-sm font-bold uppercase text-gray-100 shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                >
                                    Read
                                </button>
                            </div>
                        </div>
                    ))}
                </div> */}
            </div>
        </UnauthenticatedLayout>
    );
}
