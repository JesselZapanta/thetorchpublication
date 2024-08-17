
import UnauthenticatedLayout from '@/Layouts/UnauthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react'

export default function ReadArticle({ auth, article, categories, userRating }) {
    return (
        <UnauthenticatedLayout
            auth={auth}
            categories={categories}
            user={auth.user}
            header={
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {article.title}
                    </h2>
                </div>
            }
        >
            {/* <div>{JSON.stringify(article, undefined, 2)}</div> */}
            <Head title={`Article ${article.title}`} />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative">
                            <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full px-6 py-2 bg-slate-800 bg-opacity-50">
                                <p className="italic text-justify text-white text-xs">
                                    {article.caption}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row justify-between">
                                {/* ID */}
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full overflow-hidden w-14 h-14 border-2 border-indigo-500">
                                        {article.article_image_path && (
                                            <img
                                                src={
                                                    article.createdBy
                                                        .profile_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                alt={article.article_image_path}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Author: {article.createdBy.name}
                                        </h4>
                                        <p className="mt-1">
                                            Publish: {article.created_at}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">
                                        Category: {article.category.name}
                                    </h4>
                                    {/* <RatingComponent
                                        articleId={article.id}
                                        userRating={userRating}
                                    /> */}
                                </div>
                            </div>
                            {/* Body */}
                            <div className="mt-8">
                                <p className="text-base text-justify whitespace-pre-line">
                                    {article.body}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UnauthenticatedLayout>
        // <div>{JSON.stringify(article, undefined, 2)}</div>
    );
}
