import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);
  const pagedTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  const navigate = useNavigate();
  function handlePreviousPage() {
    setSearchParams({ page: String(Math.max(currentPage - 1, 1)) });
  }
  function handleNextPage() {
    setSearchParams({ page: String(Math.min(currentPage + 1, totalPages)) });
  }
  useEffect(() => {
    if (totalPages > 0) {
      if (
        typeof currentPage !== 'number' ||
        currentPage < 1 ||
        currentPage > totalPages
      ) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);
  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <>
          <ul className={styles.list}>
            {pagedTodos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
          </ul>
          <div className={styles.paginationControls}>
            <button
              onClick={() => handlePreviousPage()}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handleNextPage()}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default TodoList;
