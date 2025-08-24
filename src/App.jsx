import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoList/TodoForm';
import { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.message || 'Request failed');
        }
        const { records } = await resp.json();
        setTodoList(
          records.map((record) => {
            const todo = {
              id: record.id,
              ...record.fields,
            };
            if (!todo.isCompleted) {
              todo.isCompleted = false;
            }
            return todo;
          })
        );
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);
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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }
  async function completeTodo(id) {
    setIsSaving(true);
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: true,
        };
      } else {
        return todo;
      }
    });
    setTodoList([...updatedTodos]);
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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }
  async function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList([...updatedTodos]);
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message || 'Request failed');
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return { ...originalTodo };
        } else {
          return todo;
        }
      });
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage !== '' && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
