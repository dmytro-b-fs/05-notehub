import axios from 'axios';
import type { Note, NoteFormData } from '../types/note.ts';

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface NotesResponse {
    notes: Note[];
    totalPages: number;
}



export async function getNotes(search: string | undefined, page: number, perPage: number): Promise<NotesResponse> {
  const params: Record<string, string> = { page: `${page}`, perPage: `${perPage}` };
  
  if (search && search.trim()) {
    params.search = search.trim();
  }
  
  const response = await axios.get<NotesResponse>("https://notehub-public.goit.study/api/notes", {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    params,
  });
  console.log(response.data);
  return response.data;
}

export async function createNote(noteData: NoteFormData): Promise<Note> {
  const response = await axios.post<Note>("https://notehub-public.goit.study/api/notes", noteData, {
    headers: { Authorization: `Bearer ${API_TOKEN}`},
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}`},
  });
  return response.data;
}