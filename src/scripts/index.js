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
createTodo(['Today'], 'Buy pumpkin seeds', 'Make sure not to get the kernel-only stuff', null, 1);
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
  const todoArray = readAllTodos(list);

  for (const todoData of todoArray) {
    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.setAttribute('data-todoID', todoData.todoID);

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.setAttribute('type', 'checkbox');

    todoElem.appendChild(checkbox);

    const stackGroup = document.createElement('div');
    stackGroup.classList.add('stack-group');

    const rowGroup1 = document.createElement('div');
    rowGroup1.classList.add('row-group');

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = todoData.description;

    const notes = document.createElement('p');
    notes.classList.add('notes');
    notes.textContent = todoData.notes;

    rowGroup1.append(description, notes);

    stackGroup.appendChild(rowGroup1);

    const rowGroup2 = document.createElement('div');
    rowGroup2.classList.add('row-group');

    const priority = document.createElement('button');
    priority.classList.add('priority');
    const priorityIcon = document.createElement('span');
    let priorityText;
    switch (todoData.priority) {
      case 1:
        priority.classList.add('low');
        priorityText = 'Low';
        break;
      case 2:
        priority.classList.add('normal');
        priorityText = 'Normal';
        break;
      case 3:
        priority.classList.add('high');
        priorityText = 'High';
        break;
    }
    priority.append(priorityIcon, priorityText);

    rowGroup2.appendChild(priority);

    const datetimedue = document.createElement('button');
    datetimedue.classList.add('datetimedue');
    const datetimedueIcon = document.createElement('span');
    let datetimedueText;
    if (todoData.datetimedue) {
      datetimedue.classList.add('scheduled');
      datetimedueText = todoData.datetimedue;
    } else {
      datetimedue.classList.add('anytime');
      datetimedueText = 'Anytime';
    }
    datetimedue.append(datetimedueIcon, datetimedueText);

    rowGroup2.appendChild(datetimedue);

    if (todoData.lists.length == 2) {
      const linkedList = document.createElement('button');
      linkedList.classList.add('linked-list');
      linkedList.title = 'source: ' + todoData.lists[1];
      const linkedListIcon = document.createElement('img');
      linkedListIcon.src = scrollImg;
      linkedList.appendChild(linkedListIcon);

      rowGroup2.appendChild(linkedList);
    }

    stackGroup.appendChild(rowGroup2);

    todoElem.appendChild(stackGroup);

    contentArea.appendChild(todoElem);
  }
}

displayTodos('Today');
