import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoList/TodoForm';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  addTodo,
  completeTodo,
  updateTodo,
  todoState,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      ></TodosViewForm>
    </>
  );
}

export default TodosPage;
