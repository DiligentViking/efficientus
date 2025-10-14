const createProfile = () => {
  if (localStorage.length) {
    return;
  }

  localStorage.setItem('todos', '[]');
  localStorage.setItem('lists', '[]');
  localStorage.setItem('settings', '{}');
}


const createList = (listName) => {
  const listsJSON = localStorage.getItem('lists');
  const lists = JSON.parse(listsJSON);

  if (lists.includes(listName)) {
    return 0;
  }

  lists.push(listName);

  localStorage.setItem('lists', JSON.stringify(lists));

  return 1;
}


const readLists = () => {
  const listsJSON = localStorage.getItem('lists');
  const lists = JSON.parse(listsJSON);

  return lists;
}


const getTodos = () => {
  const todosJSON = localStorage.getItem('todos');
  const todos = JSON.parse(todosJSON);

  return todos;
}


const setTodos = (todos) => {
  const todosJSON = JSON.stringify(todos);

  localStorage.setItem('todos', todosJSON);
}


export { createProfile, createList, readLists, getTodos, setTodos };
