import './App.css';
import styles from './App.module.css';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  const location = useLocation();
  const [title, setTitle] = useState('Todo List');
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Todo List');
        break;
      case '/about':
        setTitle('About');
        break;
      default:
        setTitle('');
    }
  }, [location]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.message || 'Request failed');
        }
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records: records });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          errorMessage: error.message,
        });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };
    fetchTodos();
  }, [sortDirection, sortField, queryString]);
  async function addTodo(title) {
    const payload = { records: [{ fields: { title: title } }] };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    };
    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records: records });
    } catch (error) {
      console.error(error.message);
      dispatch({ type: todoActions.setLoadError, errorMessage: error.message });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  async function completeTodo(id) {
    dispatch({ type: todoActions.startRequest });
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    dispatch({ type: todoActions.completeTodo, id: id });
    const payload = {
      records: [
        {
          id: originalTodo.id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
    } catch (error) {
      console.error(error.message);
      dispatch({ type: todoActions.setLoadError, errorMessage: error.message });
      dispatch({
        type: todoActions.revertTodo,
        id: id,
        originalTodo: originalTodo,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  async function updateTodo(editedTodo) {
    dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
    } catch (error) {
      console.error(error.message);
      dispatch({ type: todoActions.setLoadError, errorMessage: error.message });
      dispatch({ type: todoActions.revertTodo, originalTodo: originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }
  return (
    <>
      <div className={styles.app}>
        <Header title={title} />
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                addTodo={addTodo}
                completeTodo={completeTodo}
                updateTodo={updateTodo}
                todoState={todoState}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                sortField={sortField}
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {todoState.errorMessage !== '' && (
          <div className={styles.error}>
            <hr className={styles.spacing} />
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: todoActions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
