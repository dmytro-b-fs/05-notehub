import axios from 'axios';
import type { Movie } from '../types/movie.ts';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export interface MoviesResponse {
    results: Movie[];
    page: number;
    total_results: number;
    total_pages: number;
}

export async function getMovieListByQuery(queryString: string, page: number): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>("https://api.themoviedb.org/3/search/movie", {
    headers: { Authorization: `Bearer ${API_TOKEN}`, accept: "application/json" },
    params: { query: queryString, page: page },
  });

  return response.data;
}