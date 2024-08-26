import UnauthenticatedLayout from '@/Layouts/UnauthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react'

export default function Index({ auth, categories }) {
    return (
        <UnauthenticatedLayout
            user={auth.user}
            categories={categories}
            header={
                <div className="max-w-7xl mt-16 mx-auto flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        Freedom Wall
                    </h2>
                </div>
            }
        >
            <Head title="Freedom Wall" />
        </UnauthenticatedLayout>
    );
}
