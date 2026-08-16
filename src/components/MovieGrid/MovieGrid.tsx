import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
    onSelect: (movie: Movie) => void;
    movies: Movie[];
}

export default function MovieGrid({onSelect,movies}: MovieGridProps) {
  const movieRender = (movie: Movie) => {
    return (
      <li key={movie.id} onClick={() => onSelect(movie)}>
        <div className={css.card}>
          <img
            className={css.image}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
          <h2 className={css.title}>{movie.title}</h2>
        </div>
      </li>
    );
  };
  const movieList = movies?.map((movie) => movieRender(movie));
  return <ul className={css.grid}>{movieList}</ul>;
}
