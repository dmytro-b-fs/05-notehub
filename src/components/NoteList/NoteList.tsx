import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note.ts";
import { toast } from "react-hot-toast";

interface NoteListProps {
  notes: Note[] | undefined;
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const noteRender = (note: Note) => {
    return (
      <li className={css.listItem} key={note.id}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <button
            className={css.button}
            onClick={() => handleDelete(note.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </li>
    );
  };

  const noteList = notes?.map((note) => noteRender(note));
  return <ul>{noteList}</ul>;
}
