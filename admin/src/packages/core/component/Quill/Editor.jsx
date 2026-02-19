import React from "react";
import ReactQuill, { Quill } from "react-quill-new";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill-new/dist/quill.snow.css";

// Register Size whitelist explicitly to ensure it loads
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

export const Editor = ({ value, onChange, placeholder }) => {
    return (
        <div className="text-editor">
            <EditorToolbar />
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Write something awesome..."}
                modules={modules}
                formats={formats}
            />
        </div>
    );
};