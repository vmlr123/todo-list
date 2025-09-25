export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };
    case actions.loadTodos:
      const mappedArray = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return { ...state, todoList: mappedArray, isLoading: false };
    case actions.setLoadError:
      return { ...state, errorMessage: action.errorMessage, isLoading: false };
    case actions.startRequest:
      return { ...state, isSaving: true };
    case actions.addTodo:
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };
    case actions.revertTodo:
      action.editedTodo = action.originalTodo;
    case actions.updateTodo:
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return { ...action.editedTodo };
        } else {
          return todo;
        }
      });
      const updatedState = { ...state, todoList: [...updatedTodos] };
      if (action.error) {
        updatedTodos.errorMessage = action.errorMessage;
      }
      return updatedState;
    case actions.completeTodo:
      const updatedTodoList = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return {
            ...todo,
            isCompleted: true,
          };
        } else {
          return todo;
        }
      });
      return { ...state, todoList: [...updatedTodoList] };

    case actions.clearError:
      return { ...state, errorMessage: '' };
  }
}
export default initialState;
