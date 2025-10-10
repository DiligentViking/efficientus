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
  console.log(`Todos for "${list}":`);
  for (let x = 0; x < localStorage.length; x++) {
    const data = localStorage.getItem(x);
    const todo = JSON.parse(data);

    if (todo.lists.includes(list)) {
      console.log(todo);
    }
  }
}

export { createTodo, readAllTodos };
