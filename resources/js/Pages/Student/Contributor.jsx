import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ auth, StudentBadgeCount, existingEntry }) {
    const { data, setData, post, errors, processing } = useForm({
        name: existingEntry.data.name || "",
        institute: existingEntry.data.institute || "",
        program: existingEntry.data.program || "",
        sample_work_file_path: "",
    });

    const onSubmit = () => {
        post(route("student-contributor.store", data));
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
        <StudentAuthenticatedLayout
            StudentBadgeCount={StudentBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between h-6">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Apply to be a Contributor
                    </h2>
                </div>
            }
        >
            <Head title="Apply to be a Contributor" />
            {/* <pre className="text-gray-900">
                {JSON.stringify(existingEntry, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {existingEntry && (
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
                                        Application Status
                                    </p>
                                    <p className="text-sm">
                                        {existingEntry.data.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* sample_work_file_path */}
                        <div className="mt-4">
                            {existingEntry.data.sample_work_file_path && (
                                <div className="w-full h-[400px]">
                                    <iframe
                                        className="w-full h-full"
                                        src={
                                            existingEntry.data.sample_work_file_path
                                        }
                                    ></iframe>
                                </div>
                            )}
                        </div>
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            {/* title */}
                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="name" value="Full Name" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex gap-4">
                                {/* Institute */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="institute"
                                        value="Institute"
                                    />

                                    <TextInput
                                        id="institute"
                                        type="text"
                                        name="institute"
                                        value={data.institute}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData("institute", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.institute}
                                        className="mt-2"
                                    />
                                </div>

                                {/* program */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="program"
                                        value="Program"
                                    />

                                    <TextInput
                                        id="program"
                                        type="text"
                                        name="program"
                                        value={data.program}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData("program", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.program}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* sample_work_file_path */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="sample_work_file_path"
                                    value="Sample Work"
                                />

                                <TextInput
                                    id="sample_work_file_path"
                                    type="file"
                                    name="sample_work_file_path"
                                    className="mt-2 block w-full cursor-pointer"
                                    onChange={(e) =>
                                        setData(
                                            "sample_work_file_path",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.sample_work_file_path}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("student-article.index")}
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
                        Are you sure you want to Submit this Article?
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
                            {processing ? "Processing" : "Submit"}
                        </button>
                    </div>
                </div>
            </Modal>
        </StudentAuthenticatedLayout>
    );
}
//own server
//or vps