import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Modal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useState, useEffect, useCallback, useMemo } from "react";
import NoteList from "../NoteList/NoteList.tsx";
import { getNotes, createNote } from "../../services/noteService.ts";
import type { NoteFormData } from "../../types/note.ts";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import debounce from "lodash.debounce";

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
    if (notes?.notes && notes.notes.length === 0 && query) {
      toast.error("No notes found for your request.");
    }
  }, [notes, query]);

  // Дебаунсований обработчик поиска
  const debouncedSetQuery = useMemo(
    () => debounce((searchQuery: string) => {
      setCurrentPage(1);
      setQuery(searchQuery);
    }, 300),
    []
  );

  const handleSearch = useCallback((searchQuery: string) => {
    debouncedSetQuery(searchQuery);
  }, [debouncedSetQuery]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const handleCreateNote = async (noteData: NoteFormData) => {
    await createMutation.mutateAsync(noteData);
  };



  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearch} />
          {isSuccess && notes.totalPages > 1 && (
            <Pagination
              pageCount={notes.totalPages}
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
      {isSuccess && <NoteList notes={notes?.notes || []} />}
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onClose={closeModal} onSubmit={handleCreateNote} />
      </Modal>

      <Toaster position="top-center" />
    </>
  );
}
