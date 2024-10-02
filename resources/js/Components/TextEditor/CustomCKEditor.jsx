import React, { useRef, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // Ensure you import the correct editor build

import "ckeditor5/ckeditor5.css";

const CustomCKEditor = ({
    value,
    onChange,
    className = "",
    id,
    isReadOnly = false,
}) => {
    const editorRef = useRef();

    useEffect(() => {
        if (editorRef.current) {
            if (isReadOnly) {
                editorRef.current.enableReadOnlyMode("feature-id"); // Enable read-only mode
            } else {
                editorRef.current.disableReadOnlyMode("feature-id"); // Disable read-only mode
            }
        }
    }, [isReadOnly]); // Re-run effect when isReadOnly changes

    return (
        <div className={className}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onReady={(editor) => {
                    editorRef.current = editor; // Store the editor instance
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data); // Call onChange to update the state
                }}
                onBlur={(event, editor) => {
                    const data = editor.getData();
                    onChange(data); // Ensure data is updated on blur
                }}
                config={{
                    toolbar: {
                        items: [
                            "undo",
                            "redo",
                            "|",
                            "bold",
                            "italic",
                            "underline",
                            "|",
                            "link",
                            "blockQuote",
                            "|",
                            "outdent",
                            "indent",
                        ],
                    },
                    heading: {
                        options: [
                            {
                                model: "paragraph",
                                title: "Paragraph",
                                class: "ck-heading_paragraph",
                            },
                            {
                                model: "heading1",
                                view: "h1",
                                title: "Heading 1",
                                class: "ck-heading_heading1",
                            },
                            {
                                model: "heading2",
                                view: "h2",
                                title: "Heading 2",
                                class: "ck-heading_heading2",
                            },
                            {
                                model: "heading3",
                                view: "h3",
                                title: "Heading 3",
                                class: "ck-heading_heading3",
                            },
                            {
                                model: "heading4",
                                view: "h4",
                                title: "Heading 4",
                                class: "ck-heading_heading4",
                            },
                        ],
                    },
                    // Other configurations...
                }}
            />
        </div>
    );
};

export default CustomCKEditor;
