import { Head, useForm } from '@inertiajs/react'
import DesignerAuthenticatedLayout from "@/Layouts/DesignerAuthenticatedLayout";
import React, { useState } from 'react'
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextAreaInput from '@/Components/TextAreaInput';

export default function Edit({ auth, publication, DesignerBadgeCount }) {
    const { data, setData, post, errors } = useForm({
        category: publication.category || "",
        description: publication.description || "",
        publication_thumbnail_image_path: "",
        publication_file_path: "",
        status: publication.status || "",
        revision_message: publication.revision_message || "",
        _method: "PUT",
    });

    const onSubmit = () => {
        post(route("designer-publication.update", publication.id));
    };

    const [confirmUpdate, setConfirmUpdate] = useState(false);

    const openUpdateModal = () => {
        setConfirmUpdate(true);
    };

    const handleConfirmUpdate = () => {
        setConfirmUpdate(false);
        onSubmit();
    };

    return (
        <DesignerAuthenticatedLayout
            DesignerBadgeCount={DesignerBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Publication
                    </h2>
                </div>
            }
        >
            <Head title="Edit Publication" />

            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {publication.revision_message &&
                        publication.status !== "distributed" &&(
                            <div
                                className="bg-red-100 mb-4 border-t-4 border-red-500 rounded-b-lg text-red-900 px-4 py-3 shadow-md"
                                role="alert"
                            >
                                <div className="flex">
                                    <div className="py-1">
                                        <svg
                                            className="fill-current h-6 w-6 text-red-500 mr-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            Revision Message:
                                        </p>
                                        <p className="text-sm">
                                            {publication.revision_message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {publication.publication_file_path && (
                            <div className="w-full h-[400px]">
                                <iframe
                                    className="w-full h-full"
                                    src={publication.publication_file_path}
                                    frameBorder="0"
                                ></iframe>
                            </div>
                        )}
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            {/* Category */}
                            <div className="w-full">
                                <InputLabel htmlFor="status" value="Category" />

                                <SelectInput
                                    name="category"
                                    id="category"
                                    value={data.category}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                >
                                    <option value="">Select a Category</option>
                                    <option value="newsletter">
                                        Newsletter
                                    </option>
                                    <option value="folio">Folio</option>
                                    <option value="tabloid">Tabloid</option>
                                </SelectInput>

                                <InputError
                                    message={errors.category}
                                    className="mt-2"
                                />
                            </div>
                            {/* description */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Publication Description"
                                />

                                <TextInput
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={data.description}
                                    className="mt-2 block w-full"
                                     
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex gap-2">
                                {/* publication_thumbnail_image_path */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="publication_thumbnail_image_path"
                                        value="Publication Thumbnail"
                                    />

                                    <TextInput
                                        id="publication_thumbnail_image_path"
                                        type="file"
                                        name="publication_thumbnail_image_path"
                                        className="mt-2 block w-full cursor-pointer"
                                        onChange={(e) =>
                                            setData(
                                                "publication_thumbnail_image_path",
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.publication_thumbnail_image_path
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Pdf File, */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="publication_file_path"
                                        value="Publication Pdf File"
                                    />

                                    <TextInput
                                        id="publication_file_path"
                                        type="file"
                                        name="publication_file_path"
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "publication_file_path",
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.publication_file_path}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("designer-publication.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openUpdateModal}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Update Modal */}
            <Modal show={confirmUpdate} onClose={() => setConfirmUpdate(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Update</h2>
                    <p className="mt-4">
                        Are you sure you want to Update this Publication?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmUpdate(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            onClick={handleConfirmUpdate}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </DesignerAuthenticatedLayout>
    );
}
