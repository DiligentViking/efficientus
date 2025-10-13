const createTodo = (lists, desc, doDate, priority) => {
  const todoId = localStorage.length;

  const todoData = {
    lists,
    desc,
    doDate,
    priority
  };

  localStorage.setItem(
    todoId,
    JSON.stringify(todoData)
  );
}


const readTodo = (todoId) => {
  return JSON.parse(localStorage.getItem(todoId));
}

const readAllTodos = (list) => {
  const todos = [];

  console.log(`Todos for "${list}":`);
  for (let x = 0; x < localStorage.length; x++) {
    const todoData = readTodo(x);

    if (!list || todoData.lists.includes(list) && (!todoData.lists.includes('trash') || list == 'trash')) {
      todos.push(todoData);
    }
  }

  return todos;
}


const updateTodo = (todoId, prop, val) => {
  const todoData = readTodo(todoId);

  todoData[prop] = val;

  localStorage.setItem(todoId, JSON.stringify(todoData));
}


const deleteTodo = (todoId, trash=true) => {
  if (trash) {
    const todoData = readTodo(todoId);

    todoData.lists.push('trash');

    localStorage.setItem(todoId, JSON.stringify(todoData));
  }
}


export { createTodo, readTodo, readAllTodos, updateTodo, deleteTodo };
