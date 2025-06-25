"use client";

import { useRef, useCallback, useEffect } from 'react';
import styles from './FormattedTextArea.module.css';

interface FormattedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  fieldName: string;
  variant?: 'basic' | 'full';
}

export default function FormattedTextArea({
  value,
  onChange,
  placeholder = "Écrivez votre contenu...",
  readOnly = false,
  fieldName,
  variant = 'basic'
}: FormattedTextAreaProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchroniser le contenu HTML avec la valeur
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Gestion du changement de contenu
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== value) {
        onChange(newContent);
      }
    }
  }, [value, onChange]);

  // Formatage du texte sélectionné
  const formatText = useCallback((command: string, value?: string) => {
    if (readOnly) return;
    
    // Sauvegarder la sélection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Appliquer le formatage
    document.execCommand(command, false, value);
    
    // Déclencher l'événement de changement
    handleContentChange();
  }, [readOnly, handleContentChange]);

  // Handlers pour les boutons
  const handleBold = () => formatText('bold');
  const handleItalic = () => formatText('italic');
  const handleBulletList = () => formatText('insertUnorderedList');
  
  // Handlers supplémentaires pour variant="full"
  const handleH2 = () => formatText('formatBlock', 'h2');
  const handleH3 = () => formatText('formatBlock', 'h3');
  const handleLink = () => {
    const url = prompt('Entrez l\'URL du lien :');
    if (url) {
      formatText('createLink', url);
    }
  };
  const handleClean = () => formatText('removeFormat');

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      {!readOnly && (
        <div className={styles.toolbar}>
          <button
            type="button"
            onClick={handleBold}
            className={styles.toolbarButton}
            title="Gras"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={handleItalic}
            className={styles.toolbarButton}
            title="Italique"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={handleBulletList}
            className={styles.toolbarButton}
            title="Liste à puces"
          >
            •
          </button>
          
          {/* Boutons supplémentaires pour variant="full" */}
          {variant === 'full' && (
            <>
              <div className={styles.separator}></div>
              <button
                type="button"
                onClick={handleH2}
                className={styles.toolbarButton}
                title="Titre niveau 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={handleH3}
                className={styles.toolbarButton}
                title="Titre niveau 3"
              >
                H3
              </button>
              <div className={styles.separator}></div>
              <button
                type="button"
                onClick={handleLink}
                className={styles.toolbarButton}
                title="Insérer un lien"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={handleClean}
                className={styles.toolbarButton}
                title="Supprimer le formatage"
              >
                ✂️
              </button>
            </>
          )}
        </div>
      )}

      {/* Éditeur WYSIWYG */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className={styles.editor}
        data-field-name={fieldName}
        data-placeholder={!value ? placeholder : ''}
        suppressContentEditableWarning={true}
      />

      {/* Aide rapide */}
      {!readOnly && (
        <div className={styles.help}>
          <small>
            Sélectionnez du texte et cliquez sur les boutons pour le formater en temps réel.
          </small>
        </div>
      )}
    </div>
  );
}