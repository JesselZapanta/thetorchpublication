import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, errors } = useForm({
        student_id: "",
        username: "",
        name: "",
        role: "",
        position: "",
        email: "",
        password: "",
        password_confirmation: "",
        profile_image_path: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("user.store", data));
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create New User Account
                    </h2>
                </div>
            }
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            <div>
                                <InputLabel
                                    htmlFor="student_id"
                                    value="Student ID"
                                />

                                <TextInput
                                    id="student_id"
                                    type="text"
                                    name="student_id"
                                    value={data.student_id}
                                    className="mt-2 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("student_id", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.student_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="username"
                                    value="User Name"
                                />

                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.username}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
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
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-2 w-full">
                                <InputLabel htmlFor="role" value="User Role" />

                                <SelectInput
                                    name="role"
                                    id="role"
                                    value={data.role}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="">Select a Role</option>
                                    <option value="student">Student</option>
                                    <option value="student_contributor">
                                        Student Contributor
                                    </option>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="writer">Writer</option>
                                    <option value="designer">Designer</option>
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
                                        setData("position", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.position}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="User Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="off"
                                    value={data.password}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="off"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="profile_image_path"
                                    value="Profile Image"
                                />

                                <TextInput
                                    id="profile_image_path"
                                    type="file"
                                    name="profile_image_path"
                                    className="mt-2 block w-full cursor-pointer"
                                    onChange={(e) =>
                                        setData(
                                            "profile_image_path",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.profile_image_path}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton href={route("user.index")}>
                                    Cancel
                                </SecondaryButton>
                                <button className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
