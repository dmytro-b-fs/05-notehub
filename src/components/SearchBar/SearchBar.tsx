import styles from "./SearchBar.module.css";
import toast from 'react-hot-toast';


interface SearchBarProps {
    onSubmit: (query: string) => void;
}


export default function SearchBar({ onSubmit }: SearchBarProps) {
    const formHandleSubmit = (formData: FormData) => {
        const query = formData.get("query")?.toString().trim();
        if (!query) {
            toast.error("Please enter a search query.");
            return;
        }
        onSubmit(query);
    }



  return (
    
      <div className={styles.container}>
        <form className={styles.form} action={formHandleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    
  );
}


