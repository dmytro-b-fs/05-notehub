import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (query: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value.trim();
    onChange(query);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        name="query"
        autoComplete="off"
        placeholder="Search notes..."
        autoFocus
        onChange={handleChange}
      />
    </div>
  );
}


