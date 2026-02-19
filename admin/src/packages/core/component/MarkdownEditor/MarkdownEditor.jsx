import React, { useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
// import 'easymde/dist/easymde.min.css'; // Removed if it causes issues, usually autohandled or imported in global

export const MarkdownEditor = ({ value, onChange, placeholder }) => {
    const options = useMemo(() => {
        return {
            autofocus: false,
            spellChecker: false,
            placeholder: placeholder || "Write something...",
            status: false,
            toolbar: [
                "bold", "italic", "heading", "|",
                "quote", "unordered-list", "ordered-list", "|",
                "link", "image", "|",
                "preview", "side-by-side", "fullscreen",
            ],
            // Customizing headings or font sizes in SimpleMDE is usually done via CSS or Toolbar customization
            // For now, standard Markdown headings (#, ##, ###) serve as "font sizes".
        };
    }, [placeholder]);

    return (
        <SimpleMDE
            value={value}
            onChange={onChange}
            options={options}
        />
    );
};
