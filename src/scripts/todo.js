import { getTodos, setTodos } from './storage.js';


const createTodo = (lists, desc, doDate, priority, todos=getTodos()) => {
  const todoData = {
    lists,
    desc,
    doDate,
    priority
  };

  todos.push(todoData);

  setTodos(todos);
}


const readAllTodos = (list, todos=getTodos()) => {
  const matchingTodos = [];

  console.log(`Todos for "${list}":`);
  for (const todoData of todos) {
    if (!list || todoData.lists.includes(list) && (!todoData.lists.includes('trash') || list == 'trash')) {
      matchingTodos.push(todoData);
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
