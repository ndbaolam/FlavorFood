import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
    value: string;
    onChange: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

export function TextEditor({ value, onChange }: TextEditorProps) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'blockquote', 'code-block',
        'list', 'bullet',
        'align',
        'link', 'image',
    ];

    return (<ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
    />);
}
