import css from './NoteForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

interface NoteFormProps {
  onClose: () => void;
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

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createMutation.mutateAsync(values);
      formik.resetForm();
    },
  });

  const getFieldError = (fieldName: keyof typeof formik.values): string | undefined => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : undefined;
  };

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          {...formik.getFieldProps('title')}
          className={css.input}
        />
        {getFieldError('title') && (
          <ErrorMessage message={getFieldError('title')!} />
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          {...formik.getFieldProps('content')}
          className={css.textarea}
        />
        {getFieldError('content') && (
          <ErrorMessage message={getFieldError('content')!} />
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" {...formik.getFieldProps('tag')} className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {getFieldError('tag') && (
          <ErrorMessage message={getFieldError('tag')!} />
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}