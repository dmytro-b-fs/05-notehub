import css from "./App.module.css";
import SearchBar from "../SearchBox/SearchBox.tsx";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useState, useEffect } from "react";
import NoteList from "../NoteList/NoteList.tsx";
import MovieModal from "../Modal/Modal.tsx";
import { getNotes, createNote, deleteNote } from "../../services/noteService.ts";
import type { NoteFormData } from "../../types/note.ts";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const perPage = 5;
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: notes,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["notes", query, currentPage],
    queryFn: () => getNotes(query, currentPage, perPage),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (notes?.notes && notes.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [notes]);

  const queryHandler = (searchQuery: string) => {
    setCurrentPage(1);
    setQuery(searchQuery);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
      toast.success("Note created");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreateNote = (noteData: NoteFormData) => {
    return createMutation.mutateAsync(noteData);
  };



  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBar onSubmit={queryHandler} />
          {isSuccess && notes.total_pages > 1 && (
            <Pagination
              pageCount={notes.total_pages}
              forcePage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
      </div>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && <NoteList notes={notes?.notes || []} onDelete={handleDelete} />}
      {isModalOpen && <MovieModal onClose={closeModal} onSubmit={handleCreateNote} />}
      <Toaster position="top-center" />
    </>
  );
}
