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
};


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
};


const getLastTodoIndex = (todos=getTodos()) => {
  return todos.length - 1;
};


const updateTodo = (todoId, prop, val, todos=getTodos()) => {  // This should not really be used because it doesn't have a crisp purpose
  todos[todoId][prop] = val;

  setTodos(todos);
};


const markTodoAsDone = (todoID) => {
  updateTodo(todoID, 'isDone', 1);
}

const markTodoAsNotDone = (todoID) => {
  updateTodo(todoID, 'isDone', 0);
};


const updateTodoPriority = (todoID, priorityNumber) => {
  if ([1, 2, 3].includes(priorityNumber)) {
    updateTodo(todoID, 'priority', priorityNumber);
  } else {
    console.log('invalid');
  }
};


const getTodoDatetimedue = (todoID, todos=getTodos()) => {  // the only property we cannot interpret from the DOM [consider changing that tho]
  return todos[todoID].datetimedue;
};


const updateTodoDatetimedue = (todoID, hour, minute) => {
  const today = new Date();

  const datetimedue = {
    month: today.getMonth() + 1,  // to account for Date's 0-indexed months!
    day: today.getDate(),  // military (up to 24)
    hour: hour,
    minute: minute,
  };

  updateTodo(todoID, 'datetimedue', datetimedue);
};


const linkTodoToToday = (todoID, todos=getTodos()) => {
  if (todos[todoID].lists[0] !== 'Today') {
    todos[todoID].lists.unshift('Today');
  }

  setTodos(todos);
};

const unlinkTodoFromToday = (todoID, todos=getTodos()) => {
  if (todos[todoID].lists[0] === 'Today') {
    todos[todoID].lists.shift();
  }

  setTodos(todos);
};


const deleteTodo = (todoId, trash=true, todos=getTodos()) => {
  if (trash) {
    todos[todoId].lists.push('trash');

    setTodos(todos);
  }
};


export { createTodo, readAllTodos, getLastTodoIndex, markTodoAsDone, markTodoAsNotDone, updateTodoPriority, getTodoDatetimedue, updateTodoDatetimedue, linkTodoToToday, unlinkTodoFromToday, deleteTodo };
