import Checkbox from "@/Components/Checkbox";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import { ROLE_TEXT } from "@/constants";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Create({
    auth,
    StudentBadgeCount,
    existingApplication,
    flash,
}) {
    // Display flash messages if they exist
    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const { data, setData, post, errors, processing, reset } = useForm({
        applied_for: existingApplication?.data?.applied_for || "", // Use optional chaining
        institute: existingApplication?.data?.institute || "",
        program: existingApplication?.data?.program || "",
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

    // ===== Delere appplication///

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [application, setApplication] = useState(null); // For storing the user to edit/delete

    // Open modal and set User to delete
    const openDeleteModal = (existingApplication) => {
        // console.log(existingApplication.data.id);

        setApplication(existingApplication);
        setConfirmDelete(true);
    };

    const handle = () => {
        if (application) {
            // alert(user.id);
            router.delete(
                route("student-contributor.destroy", application.data.id),
                {
                    onSuccess: () => {
                        reset();
                    },
                }
            );
        }
        setConfirmDelete(false);
        setApplication(null);
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
                    <div className="flex gap-4">
                        <SecondaryButton href={route("student.dashboard")}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }
        >
            <Head title="Apply to be a Contributor" />

            <ToastContainer position="bottom-right" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(existingApplication, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {existingApplication &&
                        existingApplication.data.status === "pending" && (
                            <div
                                className="bg-amber-100 mb-4 border-t-4 border-amber-500 rounded-b-lg text-amber-900 px-4 py-3 shadow-md"
                                role="alert"
                            >
                                <div className="flex">
                                    <div className="py-1">
                                        <svg
                                            className="fill-current h-6 w-6 text-amber-500 mr-4"
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
                                        <p className="text-sm uppercase">
                                            {existingApplication.data.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    {existingApplication &&
                        existingApplication.data.status === "rejected" && (
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
                                        <p className="text-sm uppercase">
                                            {existingApplication.data.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    {existingApplication &&
                        existingApplication.data.status === "approved" && (
                            <div
                                className="bg-teal-100 mb-4 border-t-4 border-teal-500 rounded-b-lg text-teal-900 px-4 py-3 shadow-md"
                                role="alert"
                            >
                                <div className="flex">
                                    <div className="py-1">
                                        <svg
                                            className="fill-current h-6 w-6 text-teal-500 mr-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold">
                                            Application Status (You are now a{" "}
                                            {ROLE_TEXT[auth.user.role]})
                                        </p>
                                        <p className="text-sm uppercase">
                                            {existingApplication.data.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* sample_work_file_path */}
                        <div className="mt-4">
                            {existingApplication?.data
                                ?.sample_work_file_path && (
                                <div className="w-full h-[400px]">
                                    <iframe
                                        className="w-full h-full"
                                        src={
                                            existingApplication.data
                                                .sample_work_file_path
                                        }
                                    ></iframe>
                                </div>
                            )}
                        </div>
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            <div className="flex gap-4">
                                {/* applied_for */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="applied_for"
                                        value="Applied For"
                                    />

                                    <SelectInput
                                        name="applied_for"
                                        id="applied_for"
                                        value={data.applied_for}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "applied_for",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select a Role</option>
                                        <option value="student_contributor">
                                            Student Contributor
                                        </option>
                                        {/* <option value="editor">Editor</option>
                                        <option value="writer">Writer</option>
                                        <option value="designer">
                                            Designer
                                        </option> */}
                                    </SelectInput>

                                    <InputError
                                        message={errors.applied_for}
                                        className="mt-2"
                                    />
                                </div>
                                {/* sample_work_file_path */}
                                <div className="w-full mt-4">
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

                            <div className="mt-6 flex justify-end gap-2">
                                {existingApplication && (
                                    <DangerButton
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(existingApplication)
                                        }
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                    >
                                        Delete
                                    </DangerButton>
                                )}
                                {(!existingApplication ||
                                    existingApplication.data.status !==
                                        "approved") && (
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                        onClick={openSubmitModal}
                                    >
                                        Submit
                                    </button>
                                )}
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
                        Are you sure you want to submit this application?
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

            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete this application?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handle} className="ml-2">
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </StudentAuthenticatedLayout>
    );
}
//own server
//or vps
