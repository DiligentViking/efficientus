const createProfile = (profileKey='local1') => {
  const profileData = {
    todos: [],
    settings: {},
  };
  
  localStorage.setItem(profileKey, JSON.stringify(profileData));
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


export { createProfile, getTodos, setTodos };
