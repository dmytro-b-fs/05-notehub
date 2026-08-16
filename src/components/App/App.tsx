
import './App.module.css'
import SearchBar from '../SearchBar/SearchBar'
import {Toaster, toast} from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useState, useEffect } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie.ts';
import { getMovieListByQuery } from '../../services/movieService.ts';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';




export default function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
 
  const { data: movies, isLoading, isError, isSuccess  } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => getMovieListByQuery(query, currentPage),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });


  useEffect(() => {
    if (movies?.results && movies.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [movies]);

  const queryHandler = (searchQuery: string) => {
    setCurrentPage(1);
    setQuery(searchQuery);
    setSelectedMovie(null);
  };

  const openModal = (movie: Movie) => { setSelectedMovie(movie); };
  const closeModal = () => { setSelectedMovie(null); };

  return (
    <>
      <SearchBar onSubmit={queryHandler} />
      {isSuccess && movies.total_pages > 1 && (
        <Pagination
          pageCount={movies.total_pages}
          forcePage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      {isLoading && query.length > 0 && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid onSelect={(movie) => { openModal(movie); }} movies={movies?.results || []} />
      {selectedMovie && (<MovieModal onClose={closeModal} movie={selectedMovie} />)}
      <Toaster position="top-center" />
    </>
  );
}


