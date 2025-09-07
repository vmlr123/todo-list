import { useEffect, useState } from 'react';

export default function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  function preventRefresh(event) {
    event.preventDefault();
  }
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search todos:</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        />
        <button type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </button>
      </div>
      <div>
        <label>Sort by</label>
        <select
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
        <label>Direction</label>
        <select
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}
