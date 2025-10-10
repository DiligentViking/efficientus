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
  console.log(`Todo "${desc.slice(0, 5)}..." (${todoId}) created.`);
}


const readAllTodos = (list) => {
  const todosInList = [];

  console.log(`Todos for "${list}":`);
  for (let x = 0; x < localStorage.length; x++) {
    const data = localStorage.getItem(x);
    const todo = JSON.parse(data);

    if (todo.lists.includes(list) || !list) {
      console.log(todo);
      todosInList.push(todo);
    }
  }

  return todosInList;
}


const updateTodo = (todoId, prop, val) => {
  const todoData = JSON.parse(localStorage.getItem(todoId));

  todoData[prop] = val;

  localStorage.setItem(todoId, JSON.stringify(todoData));
}


export { createTodo, readAllTodos, updateTodo, };
