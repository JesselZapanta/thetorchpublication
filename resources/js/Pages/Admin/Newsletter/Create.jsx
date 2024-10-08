import { Head, useForm } from '@inertiajs/react'
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import React, { useState } from 'react'
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

export default function Create({ auth, activeAy, AdminBadgeCount }) {
    const { data, setData, post, errors, processing } = useForm({
        academic_year_id: "",
        description: "",
        newsletter_thumbnail_image_path: "",
        newsletter_file_path: "",
        status: "",
    });

    const onSubmit = () => {
        post(route("newsletter.store", data));
    };

    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const openSubmitModal = () => {
        setConfirmSubmit(true);
    };

    const handleConfirmSubmit = () => {
        setConfirmSubmit(false);
        onSubmit();
    };
    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Add New Newsletter
                    </h2>
                </div>
            }
        >
            <Head title="Add New Newsletter" />
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            <div className="flex gap-2">
                                {/* AY */}
                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="academic_year_id"
                                        value="Select Academic Year"
                                    />

                                    <SelectInput
                                        name="academic_year_id"
                                        id="academic_year_id"
                                        value={data.academic_year_id}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "academic_year_id",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select a Academic Year
                                        </option>
                                        {activeAy.data.map((ay) => (
                                            <option key={ay.id} value={ay.id}>
                                                {ay.description}
                                            </option>
                                        ))}
                                    </SelectInput>

                                    <InputError
                                        message={errors.academic_year_id}
                                        className="mt-2"
                                    />
                                </div>
                                {/* Status */}
                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="status"
                                        value="Category status"
                                    />

                                    <SelectInput
                                        name="status"
                                        id="status"
                                        value={data.status}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select a status
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            {/* description */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Newsletter Description"
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
                                {/* newsletter_thumbnail_image_path */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="newsletter_thumbnail_image_path"
                                        value="Newsletter Thumbnail"
                                    />

                                    <TextInput
                                        id="newsletter_thumbnail_image_path"
                                        type="file"
                                        name="newsletter_thumbnail_image_path"
                                        className="mt-2 block w-full cursor-pointer"
                                        onChange={(e) =>
                                            setData(
                                                "newsletter_thumbnail_image_path",
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={
                                            errors.newsletter_thumbnail_image_path
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Pdf File, */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="newsletter_file_path"
                                        value="Newsletter Pdf File"
                                    />

                                    <TextInput
                                        id="newsletter_file_path"
                                        type="file"
                                        name="newsletter_file_path"
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "newsletter_file_path",
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.newsletter_file_path}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("newsletter.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openSubmitModal}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Submit Modal */}
            <Modal show={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Submit</h2>
                    <p className="mt-4">
                        Are you sure you want to Add this Newsletter?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmSubmit(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            onClick={handleConfirmSubmit}
                            disabled={processing}
                        >
                            {processing ? "Processing" : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
