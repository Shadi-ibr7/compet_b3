"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './RichTextEditor.module.css';

// Import des styles Quill
import 'react-quill-new/dist/quill.snow.css';
import '@/styles/quill-override.css';

// Import dynamique pour éviter les erreurs SSR
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className={styles.editorLoading}>Chargement de l'éditeur...</div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export interface RichTextEditorRef {
  focus: () => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder = "Écrivez votre contenu...", readOnly = false }, ref) => {
    const quillRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (quillRef.current) {
          quillRef.current.focus();
        }
      }
    }));

    // Configuration des modules Quill très simple
    const modules = {
      toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ],
    };

    const formats = [
      'bold', 'italic',
      'list'
    ];

    // Affichage pendant le montage ou si pas côté client
    if (!isMounted) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.fallbackTextarea}
          rows={10}
          readOnly={readOnly}
        />
      );
    }

    return (
      <div className={styles.editorContainer}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          modules={modules}
          formats={formats}
          className={styles.editor}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;