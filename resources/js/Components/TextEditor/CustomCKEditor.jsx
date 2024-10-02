import React, { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    Base64UploadAdapter,
    CKFinder,
    CKFinderUploadAdapter,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const CustomCKEditor = ({ value, onChange, className = "", id }) => {
    const editorRef = useRef();

    // Create a custom upload adapter for file size validation
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
            this.maxFileSizeMB = 5; // Set the maximum allowed file size in MB
        }

        upload() {
            return this.loader.file.then((file) => {
                const fileSizeMB = file.size / (1024 * 1024); // Convert file size to MB
                if (fileSizeMB > this.maxFileSizeMB) {
                    return Promise.reject(
                        `File size exceeds ${this.maxFileSizeMB} MB.`
                    );
                }

                // Proceed with the upload if file size is within the limit
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve({
                            default: reader.result,
                        });
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            });
        }

        abort() {
            // Handle aborting upload if necessary
        }
    }

    return (
        <div className={className}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onReady={(editor) => {
                    editorRef.current = editor; // Store the editor instance

                    // Add custom upload adapter to the FileRepository
                    editor.plugins.get("FileRepository").createUploadAdapter = (
                        loader
                    ) => {
                        return new MyUploadAdapter(loader);
                    };
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data); // Call onChange to update the state
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
                            // "uploadImage",
                            // "resizeImage",
                            "blockQuote",
                            // "mediaEmbed",
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
                    image: {
                        resizeOptions: [
                            {
                                name: "resizeImage:original",
                                label: "Default image width",
                                value: null,
                            },
                            {
                                name: "resizeImage:50",
                                label: "50% page width",
                                value: "50",
                            },
                            {
                                name: "resizeImage:75",
                                label: "75% page width",
                                value: "75",
                            },
                        ],
                        toolbar: [
                            "imageTextAlternative",
                            "toggleImageCaption",
                            "|",
                            "imageStyle:inline",
                            "imageStyle:wrapText",
                            "imageStyle:breakText",
                            "|",
                            "resizeImage",
                        ],
                    },
                    link: {
                        addTargetToExternalLinks: true,
                        defaultProtocol: "https://",
                    },
                    table: {
                        contentToolbar: [
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                        ],
                    },
                    plugins: [
                        Autoformat,
                        BlockQuote,
                        Bold,
                        CKFinder,
                        CKFinderUploadAdapter,
                        CloudServices,
                        Essentials,
                        Heading,
                        Image,
                        ImageCaption,
                        ImageResize,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
                        Indent,
                        IndentBlock,
                        Italic,
                        Link,
                        List,
                        MediaEmbed,
                        Mention,
                        Paragraph,
                        PasteFromOffice,
                        PictureEditing,
                        Table,
                        TableColumnResize,
                        TableToolbar,
                        TextTransformation,
                        Underline,
                    ],
                }}
            />
        </div>
    );
};

export default CustomCKEditor;
