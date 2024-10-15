// user role

import { NowIndicatorContainer } from "@fullcalendar/core/internal";

export const ROLE_TEXT = {
    student: "Student",
    student_contributor: "Student Contributor",
    editor: "Editor",
    writer: "Writer",
    designer: "Designer",
    admin: "Admin",
};

// arti Status
export const ARTICLE_STATUS_CLASS_MAP = {
    draft: "bg-gray-500",
    pending: "bg-amber-500",
    edited: "bg-blue-500",
    rejected: "bg-red-500",
    revision: "bg-rose-500",
    published: "bg-green-500",
};

export const ARTICLE_STATUS_TEXT_MAP = {
    draft: "Draft",
    pending: "Pending",
    edited: "Edited",
    rejected: "Rejected",
    revision: "Revision",
    published: "Published",
};

// Task Status
export const TASK_STATUS_CLASS_MAP = {
    pending: "bg-amber-500",
    progress: "bg-yellow-500",
    approval: "bg-blue-500",
    approved: "bg-indigo-500",
    content_revision: "bg-rose-500",
    review: "bg-violet-500",
    image_revision: "bg-rose-500",
    completed: "bg-green-500",
};
export const TASK_STATUS_TEXT_MAP = {
    pending: "Pending",
    progress: "In Progress",
    approval: "For Approval",
    approved: "Approved",
    content_revision: "Content Revision",
    review: "For Review",
    image_revision: "Image Revision",
    completed: "Completed",
};

// Task Priority
export const TASK_PRIORITY_CLASS_MAP = {
    low: "bg-gray-600",
    medium: "bg-amber-600",
    high: "bg-red-600",
};

export const TASK_PRIORITY_TEXT_MAP = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

// Newsletter  Status
export const NEWSLETTER_PRIORITY_CLASS_MAP = {
    pending: "bg-amber-600",
    revision: "bg-red-600",
    approved: "bg-teal-600",
    distributed: "bg-green-600",
};

export const NEWSLETTER_PRIORITY_TEXT_MAP = {
    pending: "Pending",
    revision: "Revision",
    approved: "Approved",
    distributed: "Distributed",
};

// AY status
export const AY_CLASS_MAP = {
    active: "bg-green-600",
    inactive: "bg-amber-600",
};

export const AY_TEXT_MAP = {
    active: "Active",
    inactive: "Inactive",
};

// Category status
export const CATEGORY_CLASS_MAP = {
    active: "bg-green-600",
    inactive: "bg-amber-600",
};

export const CATEGORY_TEXT_MAP = {
    active: "Active",
    inactive: "Inactive",
};

// Category status
export const VISIBILITY_CLASS_MAP = {
    visible: "bg-green-600",
    hidden: "bg-rose-600",
};

export const VISIBILITY_TEXT_MAP = {
    visible: "Visible",
    hidden: "Archive",
};

// Member status
export const MEMBER_CLASS_MAP = {
    active: "bg-green-600",
    inactive: "bg-amber-600",
};

export const MEMBER_TEXT_MAP = {
    active: "Active",
    inactive: "Inactive",
};

export const EMOTION_CLASS_MAP = {
    happy: "bg-yellow-700",
    sad: "bg-blue-800",
    annoyed: "bg-red-700",
    proud: "bg-green-700",
    drained: "bg-gray-700",
    inlove: "bg-pink-700",
    calm: "bg-blue-600",
    excited: "bg-purple-700",
    angry: "bg-red-800",
    down: "bg-gray-600",
};


export const getTaskDueClass = (dueDate) => {
    const now = new Date();
    const taskDueDate = new Date(dueDate);

    if (taskDueDate < now) {
        return "bg-red-600"; // Past due date
    } else {
        return "bg-green-600"; // Future due date (or on time)
    }
};