import '../styles/index.css';
import scrollImg from '../assets/images/scroll-outline.svg';

import { createProfile, createList, readLists } from './storage.js';
import { createTodo, readAllTodos, updateTodo, deleteTodo } from './todo.js';


/* Initial Population */

localStorage.clear();  // Devving
createProfile();

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

createList('Today');
createList('Odin Project');
createList('Appointments');

createTodo(['Today'], 'Feed cats', 'Check if Shunty\'s bed is waterproof, while you\'re at it.', null, 2);
createTodo(['Today', 'Odin Project'], 'Finish v1.0 of Todo app', 'Be efficient', null, 3);
createTodo(['Today'], 'Pickleball with S at the park', '', null, 2);
createTodo(['Today'], 'Buy pumpkin seeds', 'Make sure to not get the kernel-only stuff', null, 1);
createTodo(['Today', 'Appointments'], 'Get D\'s birthday present', '', null, 2);
createTodo(['Today'], 'Research how to increase reading speed', '', null, 3);
createTodo(['Appointments'], 'Discuss the thing with D', 'On the phone, if not at the place', null, 2);
createTodo(['Odin Project'], 'Check out other solutions', 'TOP guide article says it\'s essential', null, 2);
createTodo(['Odin Project'], 'Do "Linting" lesson', '', null, 1);


console.table(readAllTodos());


/* Some Globals */

// const currentPlace = 'Today';


/* Sidebar */

// List loading //

const sidebarGroupLists = document.querySelector('.sidebar-group.lists');

const listsArray = readLists();

for (const list of listsArray) {
  if (list == 'Today') continue;
  const sidebarItem = document.createElement('li');

  sidebarItem.setAttribute('class', 'sidebar-item');
  sidebarItem.setAttribute('data-list', list);

  const img = document.createElement('img');
  img.src = scrollImg;

  sidebarItem.append(img, list);

  sidebarGroupLists.appendChild(sidebarItem);
}

// Sidebar-item selection functionality //

const sidebarMenu = document.querySelector('.sidebar-menu');

sidebarMenu.addEventListener('click', (e) => {
  const dataList = e.target.dataset.list;
  if (dataList) {
    const prevSelected = sidebarMenu.querySelector('.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    e.target.classList.add('selected');
  }
});

document.querySelector('.sidebar-item.today').click();


/* Main */

const contentArea = document.querySelector('.content');

function displayTodos(list) {
  const todos = readAllTodos(list);

  for (const todo of todos) {

  }
}
