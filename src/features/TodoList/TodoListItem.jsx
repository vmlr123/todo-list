import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (isEditing === false) {
      return;
    } else {
      event.preventDefault();
      onUpdateTodo({ ...todo, title: workingTitle });
      setIsEditing(false);
    }
  }
  return (
    <li>
      <form onSubmit={(event) => handleUpdate(event)}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={(event) => handleEdit(event)}
            />
            <button type="button" onClick={() => handleCancel()}>
              Cancel
            </button>
            <button type="button" onClick={(event) => handleUpdate(event)}>
              Update
            </button>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
