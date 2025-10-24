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

createTodo(['today'], 'Feed all of the scats', '2025', 5);
createTodo(['today'], 'Pickleball with S at the park', '2025', 3);
createTodo(['today', 'odin project'], 'Finish v1.0 of Todo app', '2025', 7);
createTodo(['odin project'], 'Do "Linting" lesson', '', 1);


console.table(readAllTodos());


/* Helper Function */

function appendSingleElem(parentNode, elem, text=null, attributes={}) {  // Use this for all elems that don't have child elems in them
  const vars = {};

  vars[elem] = document.createElement(elem);
  
  vars[elem].textContent = text;

  Object.keys(attributes).forEach((attr) => {
    vars[elem].setAttribute(attr, attributes[attr]);
  });

  parentNode.appendChild(vars[elem]);
}


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

// Lists //
