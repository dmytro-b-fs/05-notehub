import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox.tsx";
import Modal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useState, useEffect, useCallback, useMemo } from "react";
import NoteList from "../NoteList/NoteList.tsx";
import { getNotes } from "../../services/noteService.ts";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import debounce from "lodash.debounce";

export default function App() {
  const perPage = 5;
  const [query, setQuery] = useState<string | undefined>(undefined);
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

  const debouncedSetQuery = useMemo(
    () => debounce((searchQuery: string) => {
      setCurrentPage(1);
      setQuery(searchQuery || undefined);
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
      
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onClose={closeModal} />
      </Modal>}

      <Toaster position="top-center" />
    </>
  );
}
