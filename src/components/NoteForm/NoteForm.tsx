import css from './NoteForm.module.css';
import { useState } from 'react';
import * as Yup from 'yup';
import type { Note, NoteFormData } from '../../types/note.ts';

interface NotesModalProps {
    onClose: () => void;
    onSubmit: (note: NoteFormData) => Promise<Note>;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be no more than 50 characters'),
  content: Yup.string()
    .max(500, 'Content must be no more than 500 characters'),
  tag: Yup.string()
    .required('Tag is required')
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag'),
});

export default function Form( { onSubmit, onClose }: NotesModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const noteData: NoteFormData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string
    };

    try {
      await validationSchema.validate(noteData, { abortEarly: false });
      setErrors({});
      await onSubmit(noteData);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <><form className={css.form} onSubmit={handleSubmit}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <input id="title" type="text" name="title" className={css.input} />
    {errors.title && <span className={css.error}>{errors.title}</span>}
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <textarea
      id="content"
      name="content"
      rows={8}
      className={css.textarea}
    />
    {errors.content && <span className={css.error}>{errors.content}</span>}
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <select id="tag" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </select>
    {errors.tag && <span className={css.error}>{errors.tag}</span>}
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
    >
      Create note
    </button>
  </div>
</form></>
  );
}