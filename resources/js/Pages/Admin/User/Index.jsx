import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import DropDownBtn from "@/Components/DropDownBtn";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { ROLE_TEXT } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { PencilSquareIcon, TrashIcon, ListBulletIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import DropdownAction from "@/Components/DropdownAction";
import SearchInput from "@/Components/SearchInput";

export default function Index({
    auth,
    users,
    queryParams = null,
    flash,
    AdminBadgeCount,
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

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [user, setUser] = useState(null); // For storing the user to edit/delete

    // Sort and Search
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("user.index"), queryParams, {
                preserveState: true,
            }); // Fetch all data when search is empty
        } else {
            queryParams[name] = value; // Set query parameter
        }
    };

    // Trigger search on Enter key press
    const onKeyPressed = (name, e) => {
        const value = e.target.value;

        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            if (value.trim() === "") {
                delete queryParams[name]; // Remove query parameter if search is empty
                router.get(
                    route("user.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("user.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("user.index"), queryParams, {
            preserveState: true,
        });
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

    // Open modal and set User to delete
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
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Users
                    </h2>

                    <div className="flex items-center relative">
                        {/* show in large screen */}
                        <div className="hidden lg:block">
                            <div className="flex gap-2">
                                <Link
                                    href={route("admin-contributor.index")}
                                    className="flex justify-center items-center px-4 py-2 text-nowrap bg-yellow-600 text-gray-50 transition-all duration-300 rounded hover:bg-yellow-700"
                                >
                                    Application
                                    {AdminBadgeCount.totalApplication > 0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalApplication >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalApplication}
                                            </span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href={route("user.create")}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Create New
                                </Link>
                            </div>
                        </div>
                        <div className="block lg:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex p-2 cursor-pointer justify-center items-center  text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700">
                                        <AdjustmentsHorizontalIcon className="w-6 text-gray-50" />
                                        Options
                                        {AdminBadgeCount.totalApplication >
                                            0 && (
                                            <>
                                                <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                    {AdminBadgeCount.totalApplication >
                                                    9
                                                        ? "9+"
                                                        : AdminBadgeCount.totalApplication}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Link
                                        href={route("user.create")}
                                        className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                    >
                                        Create New
                                    </Link>
                                    <Link
                                        href={route("admin-contributor.index")}
                                        className="flex items-center px-4 py-2 text-nowrap bg-yellow-600 text-gray-50 transition-all duration-300 rounded hover:bg-yellow-700"
                                    >
                                        Application
                                        {AdminBadgeCount.totalApplication >
                                            0 && (
                                            <>
                                                <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                    {AdminBadgeCount.totalApplication >
                                                    9
                                                        ? "9+"
                                                        : AdminBadgeCount.totalApplication}
                                                </span>
                                            </>
                                        )}
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Users" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* sort and search */}
                            <div className="w-full grid lg:grid-cols-2 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <SearchInput
                                            className="w-full"
                                            defaultValue={
                                                queryParams.student_id
                                            }
                                            placeholder="Search ID"
                                            route={route("user.index")}
                                            queryParams={queryParams}
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "student_id",
                                                    e.target.value
                                                )
                                            }
                                            onKeyPressed={(e) =>
                                                onKeyPressed("student_id", e)
                                            }
                                        />
                                    </div>
                                    <div className="w-full">
                                        <SearchInput
                                            className="w-full"
                                            defaultValue={queryParams.name}
                                            route={route("user.index")}
                                            queryParams={queryParams}
                                            placeholder="Search Name"
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                onKeyPressed("name", e)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <SearchInput
                                            className="w-full"
                                            defaultValue={queryParams.email}
                                            route={route("user.index")}
                                            queryParams={queryParams}
                                            placeholder="Search Email"
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                onKeyPressed("email", e)
                                            }
                                        />
                                    </div>
                                    <div className="w-full">
                                        <SelectInput
                                            className="w-full"
                                            defaultValue={queryParams.role}
                                            onChange={(e) =>
                                                handleSelectChange(
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
                                            <option value="admin">Admin</option>
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
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thead with sorting*/}
                                    {/* added */}
                                    <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th className="px-3 py-3 text-nowrap">
                                                Student Id
                                            </th>
                                            {/* <TableHeading
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
                                            </TableHeading> */}
                                            <th className="px-3 py-3">
                                                Profile
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
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={user.id}
                                                >
                                                    {/* <td className="px-3 py-2 text-nowrap">
                                                        {user.id}
                                                    </td> */}
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.student_id}
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

                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            // added
                                                            className="text-md text-gray-900 dark:text-gray-300"
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
                                                        {/* {user.role} */}
                                                        {ROLE_TEXT[user.role]}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {user.position}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <div className="flex items-center relative">
                                                            <DropdownAction>
                                                                <DropdownAction.Trigger>
                                                                    <div className="flex w-12 p-2 cursor-pointer justify-center items-center  text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700">
                                                                        <ListBulletIcon className="w-6" />
                                                                    </div>
                                                                </DropdownAction.Trigger>

                                                                <DropdownAction.Content>
                                                                    <DropdownAction.Link
                                                                        href={route(
                                                                            "user.edit",
                                                                            user.id
                                                                        )}
                                                                    >
                                                                        <PencilSquareIcon className="w-6 text-sky-600" />
                                                                        Edit
                                                                    </DropdownAction.Link>
                                                                    <DropdownAction.Btn
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        <TrashIcon className="w-6 text-red-600" />
                                                                        Delete
                                                                    </DropdownAction.Btn>
                                                                </DropdownAction.Content>
                                                            </DropdownAction>
                                                        </div>
                                                    </td>
                                                    {/* <td className="px-3 py-2 text-nowrap">
                                                        <Link
                                                            href={route(
                                                                "admin-article.edit",
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
                                                    </td> */}
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
                                {/* <Pagination
                                    links={users.meta.links}
                                    queryParams={queryParams}
                                /> */}
                            </div>
                            <div>
                                <Pagination
                                    links={users.meta.links}
                                    queryParams={queryParams}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Delete</h2>
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
        </AdminAuthenticatedLayout>
    );
}
