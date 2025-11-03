import '../styles/index.css';
import scrollImg from '../assets/images/scroll-outline.svg';

import { createProfile, createList, readLists } from './storage.js';
import { createTodo, readAllTodos, markTodoAsDone, markTodoAsNotDone, linkTodoToToday, unlinkTodoFromToday, deleteTodo } from './todo.js';


/* Initial Population */

// localStorage.clear();  // Devving

if (!createProfile()) { 
  createList('Today');
  createList('Odin Project');
  createList('Appointments');
  
  createTodo(['Today'], 'Feed cats', 'Check if Shunty\'s bed is waterproof, while you\'re at it. The quick brown fox jumps over the lazy dog. Five frantic fat frogs.', null, 2);
  createTodo(['Today', 'Odin Project'], 'Finish v1.0 of Todo app', 'Be efficient', null, 3);
  createTodo(['Today'], 'Pickleball with S at the park', '', null, 2);
  createTodo(['Today'], 'Buy pumpkin seeds', 'Make sure not to get the kernel-only stuff', null, 1);
  createTodo(['Appointments'], 'Discuss the thing with E', 'On the phone, if not at the place', null, 2);
  createTodo(['Today', 'Appointments'], 'Get D\'s birthday present', '', null, 2);
  createTodo(['Today'], 'Research how to increase reading speed', '', null, 3);
  createTodo(['Odin Project'], 'Check out other solutions', 'TOP guide article says it\'s essential', null, 2);
  createTodo(['Odin Project'], 'Do "Linting" lesson', '', null, 1);
}

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

console.table(readAllTodos());


/* Globals */

let currentPlace;

const sidebarMenu = document.querySelector('.sidebar-menu');
const sidebarGroupLists = document.querySelector('.sidebar-group.lists');
const listsArray = readLists();

const contentArea = document.querySelector('.content');
const contentTitle = contentArea.querySelector('.content-title');
const progressScroll = contentArea.querySelector('.progress-scroll');
const todoWrapper = contentArea.querySelector('.todo-wrapper');

let appLoad = true;


/* Sidebar */

// List loading //

for (const list of listsArray) {
  if (list === 'Today') continue;
  const sidebarItem = document.createElement('li');

  sidebarItem.setAttribute('class', 'sidebar-item');
  sidebarItem.setAttribute('data-list', list);

  const img = document.createElement('img');
  img.src = scrollImg;

  sidebarItem.append(img, list);

  sidebarGroupLists.appendChild(sidebarItem);
}

// Sidebar-item Selection //

sidebarMenu.addEventListener('click', (e) => {
  const dataList = e.target.dataset.list;

  if (dataList && dataList !== currentPlace) {
    currentPlace = dataList;

    const prevSelected = sidebarMenu.querySelector('.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    e.target.classList.add('selected');

    // Effects and Rendering //
    if (appLoad) {
      renderTodoListDOM(dataList);
      appLoad = false;
      return;
    }

    contentTitle.classList.add('no-opacity');
    todoWrapper.classList.add('no-opacity');

    setTimeout(() => {
      renderTodoListDOM(dataList);
      contentTitle.classList.remove('no-opacity');
      todoWrapper.classList.remove('no-opacity');
    }, 0.25 * 1000);
  }
});

sidebarMenu.querySelector('.sidebar-item.today').click();


/* Todo Rendering */

function renderTodoListDOM(list) {
  // Title //
  contentTitle.textContent = list;

  // Progress-scroll (1) //
  let numDoneCount = 0;
  let numTotalCount = 0;

  // Todos //
  todoWrapper.textContent = '';

  const todoArray = readAllTodos(list);

  for (const todoData of todoArray) {
    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.setAttribute('data-todoID', todoData.todoID);

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.setAttribute('type', 'checkbox');
    if (todoData.isDone === 1) {
      checkbox.classList.add('done');
      numDoneCount++;
    } else if (list !== 'Today' && todoData.lists.length == 2) {  // A lil non-SRP. Also, I'll have to change this when I have templates in addition to custom lists.
      checkbox.classList.add('doing');
    }

    todoElem.appendChild(checkbox);

    const stackGroup = document.createElement('div');
    stackGroup.classList.add('stack-group');

    const rowGroup1 = document.createElement('div');
    rowGroup1.classList.add('row-group', 'one');

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = todoData.description;

    const notes = document.createElement('p');
    notes.classList.add('notes');
    notes.textContent = todoData.notes;

    rowGroup1.append(description, notes);

    stackGroup.appendChild(rowGroup1);

    const rowGroup2 = document.createElement('div');
    rowGroup2.classList.add('row-group', 'two');

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

    if (list === 'Today' && todoData.lists.length == 2) {
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

    todoWrapper.appendChild(todoElem);

    numTotalCount++;
  }

  // Progress-scroll (2) //
  const numDone = progressScroll.querySelector('.num-done');
  const numTotal = progressScroll.querySelector('.num-total');
  const progressBar = progressScroll.querySelector('.progress-bar');

  const hashtags = Math.round(numDoneCount / numTotalCount * 12);
  const dots = 12 - hashtags;

  if (appLoad) {
    console.log('appload!'); 
    numDone.textContent = numDoneCount;
    numTotal.textContent = numTotalCount;
    progressBar.textContent = '[' + '#'.repeat(hashtags) + '.'.repeat(dots) + ']';
  } else {
    numDone.dataset.content = numDoneCount;
    numTotal.dataset.content = numTotalCount;
    progressBar.dataset.content = '[' + '#'.repeat(hashtags) + '.'.repeat(dots) + ']';

    numDone.classList.add('crossfade');
    numTotal.classList.add('crossfade');
    progressBar.classList.add('crossfade');
    
    setTimeout(() => {
      numDone.textContent = numDoneCount;
      numTotal.textContent = numTotalCount;
      progressBar.textContent = '[' + '#'.repeat(hashtags) + '.'.repeat(dots) + ']';

      numDone.classList.remove('crossfade');
      numTotal.classList.remove('crossfade');
      progressBar.classList.remove('crossfade');
    }, 0.5 * 1000);

    console.log({numDoneCount, numTotalCount});
  }
}

/* Todo Selection */

todoWrapper.addEventListener('click', (e) => {
  console.log('selected item\'s class: ' + e.target.classList[0]);
  switch (e.target.classList[0]) {
    case 'checkbox':
      const secondClass = e.target.classList[1];
      const todoID = e.target.parentNode.dataset.todoid;

      if (currentPlace !== 'Today') {
        switch (secondClass) {
          case undefined:
            e.target.classList.add('doing');
            linkTodoToToday(todoID);
            break;
          case 'doing':
            e.target.classList.remove('doing');
            unlinkTodoFromToday(todoID);
            break;
          case 'done':
            alert('Todos are checked/unchecked in Today!')
            break;
        }
      } else {
        e.target.classList.toggle('done');

        switch (secondClass) {
          case undefined:
            markTodoAsDone(todoID);
            break;
          case 'done':
            markTodoAsNotDone(todoID);
            break;
        }
      }

      break;
  }
});

/* Other */

// Progress-scroll Rollup Effect //

progressScroll.querySelector('.scroll-decor-container').addEventListener('click' , () => {
  progressScroll.classList.toggle('rollup');
});
