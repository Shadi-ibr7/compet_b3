"use client";

import { useRef, useCallback, useEffect } from 'react';
import { sanitizeHtml, validateContent } from '@/lib/security';
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

  // Gestion du changement de contenu avec sanitisation préservant les espaces
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const rawContent = editorRef.current.innerHTML;
      
      // Ne pas sanitiser si le contenu est identique
      if (rawContent === value) {
        return;
      }
      
      // Sanitiser le contenu en temps réel mais de façon moins agressive
      try {
        const sanitizedContent = sanitizeHtml(rawContent, variant);
        
        // Valider le contenu
        if (validateContent(sanitizedContent, variant)) {
          // Seulement mettre à jour si le contenu sanitisé est différent de la valeur actuelle
          if (sanitizedContent !== value) {
            onChange(sanitizedContent);
          }
          
          // Mettre à jour l'affichage seulement si nécessaire pour la sécurité
          // Éviter les modifications cosmétiques d'espaces
          if (sanitizedContent !== rawContent) {
            // Vérifier si c'est une modification de sécurité significative ou juste des espaces
            const normalizedOriginal = rawContent.replace(/\s+/g, ' ');
            const normalizedSanitized = sanitizedContent.replace(/\s+/g, ' ');
            
            if (normalizedOriginal !== normalizedSanitized) {
              // Modification de sécurité significative, mettre à jour
              editorRef.current.innerHTML = sanitizedContent;
            }
          }
        } else {
          console.warn('Contenu non valide détecté et bloqué');
          // Restaurer la valeur précédente
          editorRef.current.innerHTML = value || '';
        }
      } catch (error) {
        console.error('Erreur lors de la sanitisation:', error);
        // En cas d'erreur, restaurer la valeur précédente
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, onChange, variant]);

  // Formatage du texte sélectionné avec sécurité
  const formatText = useCallback((command: string, commandValue?: string) => {
    if (readOnly) return;
    
    // Sauvegarder la sélection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Valider la commande
    const allowedCommands = ['bold', 'italic', 'insertUnorderedList', 'formatBlock', 'createLink', 'removeFormat'];
    if (!allowedCommands.includes(command)) {
      console.warn('Commande de formatage non autorisée:', command);
      return;
    }

    // Valider la valeur de la commande si présente
    if (commandValue) {
      if (command === 'formatBlock') {
        const allowedBlocks = variant === 'full' ? ['h2', 'h3', 'p'] : ['p'];
        if (!allowedBlocks.includes(commandValue)) {
          console.warn('Type de bloc non autorisé:', commandValue);
          return;
        }
      } else if (command === 'createLink') {
        // Valider l'URL
        if (!commandValue.match(/^https?:\/\//)) {
          console.warn('URL non valide pour le lien:', commandValue);
          return;
        }
      }
    }

    try {
      // Appliquer le formatage
      document.execCommand(command, false, commandValue);
      
      // Déclencher l'événement de changement avec sanitisation
      setTimeout(() => handleContentChange(), 10);
    } catch (error) {
      console.error('Erreur lors du formatage:', error);
    }
  }, [readOnly, handleContentChange, variant]);

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