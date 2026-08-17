import css from './Modal.module.css';
// import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import type { Note, NoteFormData } from '../../types/note.ts';
import Form from '../NoteForm/NoteForm.tsx';
import { createPortal } from 'react-dom';

interface NotesModalProps {
    onClose: () => void;
    onSubmit: (note: NoteFormData) => Promise<Note>;
}



export default function MovieModal( { onSubmit, onClose }: NotesModalProps) {
  // const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (event.target === event.currentTarget) {
  //     onClose();
  //   }
  // };
  useEffect(() => {
	const handleKeyDown = (e: KeyboardEvent) => {
	  if (e.key === "Escape") {
	    onClose();
	  }
	};
	
	document.addEventListener("keydown", handleKeyDown);
	document.body.style.overflow = "hidden";

	return () => {
	  document.removeEventListener("keydown", handleKeyDown);
	  document.body.style.overflow = "";
	};
}, [onClose]);


//   return createPortal(
//     <><form className={css.form}>
//   <div className={css.formGroup}>
//     <label htmlFor="title">Title</label>
//     <input id="title" type="text" name="title" className={css.input} />
//     <span name="title" className={css.error} />
//   </div>

//   <div className={css.formGroup}>
//     <label htmlFor="content">Content</label>
//     <textarea
//       id="content"
//       name="content"
//       rows={8}
//       className={css.textarea}
//     />
//     <span name="content" className={css.error} />
//   </div>

//   <div className={css.formGroup}>
//     <label htmlFor="tag">Tag</label>
//     <select id="tag" name="tag" className={css.select}>
//       <option value="Todo">Todo</option>
//       <option value="Work">Work</option>
//       <option value="Personal">Personal</option>
//       <option value="Meeting">Meeting</option>
//       <option value="Shopping">Shopping</option>
//     </select>
//     <span name="tag" className={css.error} />
//   </div>

//   <div className={css.actions}>
//     <button type="button" className={css.cancelButton}>
//       Cancel
//     </button>
//     <button
//       type="submit"
//       className={css.submitButton}
//       disabled=false
//     >
//       Create note
//     </button>
//   </div>
// </form></>, document.body
//   );
// }

  return createPortal (<div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
>
  <div className={css.modal}>
    <Form onSubmit={onSubmit} onClose={onClose} />
  </div>
</div>, document.body
     
  );
}