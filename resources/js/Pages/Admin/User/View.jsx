import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { ROLE_TEXT } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function View({ auth, user, AdminBadgeCount, application }) {
    const { data, setData, post, errors } = useForm({
        role: user.role || "",
        position: user.position || "",

        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("admin-contributor.update", user.id));
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        User
                        <span className="italic ">
                            "{user.name}" applied for "
                            {ROLE_TEXT[application.data.applied_for]}"
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title={`View ${user.name}`} />

            {/* <pre className="text-gray-900">
                {JSON.stringify(application, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="grid sm:grid-cols-1 md:grid-cols-3">
                            <div>
                                <img
                                    src={user.profile_image_path}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <form
                                onSubmit={onSubmit}
                                className="p-4 col-span-1 md:col-span-2 sm:p8 bg-white dark:bg-gray-800 shadow "
                            >
                                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <div>
                                            <h4 className="font-bold text-base">
                                                Student ID
                                            </h4>
                                            <p className="mt-1">
                                                {user.student_id}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-bold text-base">
                                                Institute
                                            </h4>
                                            <p className="mt-1">
                                                {application.data.institute}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-bold text-base">
                                                Program
                                            </h4>
                                            <p className="mt-1">
                                                {application.data.program}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-bold text-base">
                                                Current Role
                                            </h4>
                                            <p className="mt-1">
                                                {/* {user.role} */}
                                                {ROLE_TEXT[user.role]}
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-bold text-base">
                                                Applied For
                                            </h4>
                                            <p className="mt-1">
                                                {/* {application.data.applied_for} */}
                                                {
                                                    ROLE_TEXT[
                                                        application.data
                                                            .applied_for
                                                    ]
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="w-full">
                                            <InputLabel
                                                htmlFor="role"
                                                value="User Role"
                                            />

                                            <SelectInput
                                                name="role"
                                                id="role"
                                                value={data.role}
                                                className="mt-2 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select a Role
                                                </option>
                                                <option value="student">
                                                    Student
                                                </option>
                                                <option value="student_contributor">
                                                    Student Contributor
                                                </option>
                                                {/* <option value="admin">
                                                    Admin
                                                </option>
                                                <option value="editor">
                                                    Editor
                                                </option>
                                                <option value="writer">
                                                    Writer
                                                </option>
                                                <option value="designer">
                                                    Designer
                                                </option> */}
                                            </SelectInput>

                                            <InputError
                                                message={errors.role}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <InputLabel
                                                htmlFor="position"
                                                value="Position"
                                            />

                                            <TextInput
                                                id="position"
                                                type="text"
                                                name="position"
                                                value={data.position}
                                                className="mt-2 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "position",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <InputError
                                                message={errors.position}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="mt-6 flex justify-end gap-2">
                                            <SecondaryButton
                                                href={route(
                                                    "admin-contributor.index"
                                                )}
                                            >
                                                Cancel
                                            </SecondaryButton>
                                            <button className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
