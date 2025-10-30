import { getTodos, setTodos } from './storage.js';


const createTodo = (lists, description, notes, datetimedue, priority, isDone=null, todos=getTodos()) => {
  const todoData = {
    lists,
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
    if (!list || todos[x].lists.includes(list) && (!todos[x].lists.includes('trash') || list == 'trash')) {
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

const markTodoAsDone = (todoID) => {
  updateTodo(todoID, 'isDone', 1);
}

const markTodoAsNotDone = (todoID) => {
  updateTodo(todoID, 'isDone', 0);
}

const linkTodoToToday = (todoID, todos=getTodos()) => {
  if (todos[todoID].lists[0] !== 'Today') {
    todos[todoID].lists.unshift('Today');
  }

  setTodos(todos);
}

const unlinkTodoFromToday = (todoID, todos=getTodos()) => {
  if (todos[todoID].lists[0] === 'Today') {
    todos[todoID].lists.shift();
  }

  setTodos(todos);
}


const deleteTodo = (todoId, trash=true, todos=getTodos()) => {
  if (trash) {
    todos[todoId].lists.push('trash');

    setTodos(todos);
  }
}


export { createTodo, readAllTodos, markTodoAsDone, markTodoAsNotDone, linkTodoToToday, unlinkTodoFromToday, deleteTodo };
