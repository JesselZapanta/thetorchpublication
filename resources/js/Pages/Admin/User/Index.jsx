import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    auth,
    users,
    success,
    delete_success,
    queryParams = null,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [user, setUser] = useState(null); // For storing the user to edit/delete
    // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Sort and Search
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("user.index"), queryParams);
    };

    const onKeyPressed = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("user.index"), queryParams);
    };

    // Open modal and set category to delete
    const openDeleteModal = (user) => {
        setUser(user);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (user) {
            // alert(user.id);
            router.delete(route("user.destroy", user.id));
        }
        setConfirmDelete(false);
        setUser(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Users
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("user.create")}
                            className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Create New
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Users" />
            {/* {<pre>{JSON.stringify(users, null, 2)}</pre>} */}
            {/* Alert */}
            {success && <AlertSuccess message={success} />}
            {delete_success && <AlertSuccess message={delete_success} />}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thead with search */}
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th className="px-3 py-3"></th>
                                            {/* <th className="px-3 py-3"></th> */}
                                            <th
                                                className="px-3 py-3"
                                                colSpan="2"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.student_id
                                                    }
                                                    placeholder="Search Student ID"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "student_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "student_id",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.name
                                                    }
                                                    placeholder="Search Name"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed("name", e)
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.email
                                                    }
                                                    placeholder="Search Email"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed("email", e)
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.role
                                                    }
                                                    onChange={(e) =>
                                                        searchFieldChanged(
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Role
                                                    </option>
                                                    <option value="student">
                                                        Student
                                                    </option>
                                                    <option value="student_contributor">
                                                        Student Contributor
                                                    </option>
                                                    <option value="admin">
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
                                                    </option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    {/* Thead with sorting*/}
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <TableHeading
                                                name="id"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                ID
                                            </TableHeading>
                                            <th className="px-3 py-3">
                                                Profile
                                            </th>
                                            <th className="px-3 py-3 text-nowrap">
                                                Student Id
                                            </th>
                                            <TableHeading
                                                name="name"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Name
                                            </TableHeading>
                                            <TableHeading
                                                name="email"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Email
                                            </TableHeading>
                                            <th className="px-3 py-3">Role</th>
                                            <th className="px-3 py-3">
                                                Position
                                            </th>
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map((user) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={user.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.id}
                                                    </td>
                                                    <th className="px-3 py-2 text-nowrap">
                                                        <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-indigo-500">
                                                            {user.profile_image_path && (
                                                                <img
                                                                    src={
                                                                        user.profile_image_path
                                                                    }
                                                                    className="object-cover w-full h-full"
                                                                    alt={
                                                                        user.profile_image_path
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.student_id}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            href={route(
                                                                "user.show",
                                                                user.id
                                                            )}
                                                        >
                                                            {user.name}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.role}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.position}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <Link
                                                            href={route(
                                                                "user.edit",
                                                                user.id
                                                            )}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    user
                                                                )
                                                            }
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-3 py-2 text-center"
                                                >
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                links={users.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete "{user?.name}" User?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} className="ml-2">
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
