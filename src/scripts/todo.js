import { getTodos, setTodos } from './storage.js';


const createTodo = (lists, description, notes, datetimedue, priority, todos=getTodos()) => {
  const todoData = {
    lists,
    description,
    notes,
    priority,
    datetimedue,
  };

  todos.push(todoData);

  setTodos(todos);
}


const readAllTodos = (list, todos=getTodos()) => {
  const matchingTodos = [];

  console.log(`Todos for "${list}":`);
  for (let x = 0; x < todos.length; x++) {
    if (!list || todos[x].lists.includes(list) && (!todos[x].lists.includes('trash') || list == 'trash')) {
      todos[x]['todoID'] = x;
      
      matchingTodos.push(todos[x]);
    }
  }

  return matchingTodos;
}


const updateTodo = (todoId, prop, val, todos=getTodos()) => {
  todos[todoId][prop] = val;

  setTodos(todos);
}


const deleteTodo = (todoId, trash=true, todos=getTodos()) => {
  if (trash) {
    todos[todoId].lists.push('trash');

    setTodos(todos);
  }
}


export { createTodo, readAllTodos, updateTodo, deleteTodo };
