import { getTodos, setTodos } from './storage.js';


const createTodo = (membership={inToday, customList, template, inTrash}, description, notes, datetimedue, priority, isDone=null, todos=getTodos()) => {
  const todoData = {
    membership,
    description,
    notes,
    datetimedue,
    priority,
    isDone,
  };

  todos.push(todoData);

  setTodos(todos);
}


const readAllTodos = (list, todos=getTodos()) => {
  const matchingTodos = [];

  console.log(`Todos for "${list}":`);
  for (let x = 0; x < todos.length; x++) {
    if (!list || (list === 'Today' && todos[x].membership.inToday) && ) {
      todos[x]['todoID'] = x;

      matchingTodos.push(todos[x]);
    }
  }

  return matchingTodos;
}


const updateTodo = (todoId, prop, val, todos=getTodos()) => {  // This should not really be used because it doesn't have a crisp purpose
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
