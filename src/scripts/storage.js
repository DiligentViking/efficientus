const createProfile = (profileKey='local1') => {
  const profileData = {
    todos: [],
    lists: [],
    settings: {},
  };
  
  localStorage.setItem(profileKey, JSON.stringify(profileData));
}


const createList = (listName, profileKey='local1') => {
  const profileJSON = localStorage.getItem(profileKey);
  const profileData = JSON.parse(profileJSON);

  if (profileData.lists.includes(listName)) {
    return 0;
  }

  profileData.lists.push(listName);

  localStorage.setItem(profileKey, JSON.stringify(profileData));

  return 1;
}


const readLists = (profileKey='local1') => {
  const profileJSON = localStorage.getItem(profileKey);
  const profileData = JSON.parse(profileJSON);

  return profileData.lists;
}


const getTodos = (profileKey='local1') => {
  const profileJSON = localStorage.getItem(profileKey);
  const profileData = JSON.parse(profileJSON);

  return profileData.todos;
}


const setTodos = (todos, profileKey='local1') => {
  const profileJSON = localStorage.getItem(profileKey);
  const profileData = JSON.parse(profileJSON);

  profileData.todos = todos;

  localStorage.setItem(profileKey, JSON.stringify(profileData));
}


export { createProfile, createList, readLists, getTodos, setTodos };
