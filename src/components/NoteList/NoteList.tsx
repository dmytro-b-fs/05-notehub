import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";

interface NoteListProps {
  notes: Note[] | undefined;
  onDelete: (id: string) => void;
}


// interface noteListProps {
//     notes: Note[];
// }

// export default function MovieGrid({onSelect,notes}: noteGridProps) {
//   const movieRender = (note: Note) => {
//     return (
//       <li key={note.id} onClick={() => onSelect(note)}>
//         <div className={css.card}>
//           <h2 className={css.title}>{note.title}</h2>
//         </div>
//       </li>
//     );
//   };
//   const noteList = notes?.map((note) => movieRender(note));
//   return <ul className={css.grid}>{noteList}</ul>;
// }

export default function NoteList({ notes, onDelete }: NoteListProps) {
  const movieRender = (note: Note) => {
    return (
      <li className={css.listItem} key={note.id}>
    <h2 className={css.title}>{note.title}</h2>
    <p className={css.content}>{note.content}</p>
    <div className={css.footer}>
      <span className={css.tag}>{note.tag}</span>
      <button className={css.button} onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  </li>
    );
  };
  const noteList = notes?.map((note) => movieRender(note));
  return (<ul>{noteList}</ul>);
}
