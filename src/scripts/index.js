import '../styles/index.css';
import scrollImg from '../assets/images/scroll-outline.svg';

import { createProfile, createList, readLists } from './storage.js';
import { createTodo, readAllTodos, markTodoAsDone, markTodoAsNotDone, updateTodoPriority, linkTodoToToday, unlinkTodoFromToday, deleteTodo } from './todo.js';


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
  createTodo(['Today'], 'Research how to increase reading speed', '', null, 2);
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

const listsArray = readLists();

const sidebarMenu = document.querySelector('.sidebar-menu');
const sidebarGroupLists = document.querySelector('.sidebar-group.lists');

const contentArea = document.querySelector('.content');
const contentTitle = contentArea.querySelector('.content-title');
const progressScroll = contentArea.querySelector('.progress-scroll');
const todoWrapper = contentArea.querySelector('.todo-wrapper');

const numDone = progressScroll.querySelector('.num-done');
const numTotal = progressScroll.querySelector('.num-total');
const progressBar = progressScroll.querySelector('.progress-bar');

let appLoad = true;


/* Sidebar */

// List loading //

for (const list of listsArray) {
  if (list === 'Today') continue;
  const sidebarItem = document.createElement('li');

  sidebarItem.setAttribute('class', 'sidebar-item');
  sidebarItem.dataset.list = list;

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
  let numDoingCount = 0;

  // Todos //
  todoWrapper.textContent = '';

  const todoArray = readAllTodos(list);

  for (const todoData of todoArray) {
    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.dataset.todoid = todoData.todoID;

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.dataset.todoid = todoData.todoID;
    if (todoData.isDone === 1) {
      checkbox.classList.add('done');
      if (list !== 'Today') {
        checkbox.classList.add('no-hover');
      }
      numDoneCount++;
    } else if (list !== 'Today' && todoData.lists.length == 2) {  // A lil non-SRP. Also, I'll have to change this when I have templates in addition to custom lists.
      checkbox.classList.add('doing');
      numDoingCount++;
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
    priority.dataset.todoid = todoData.todoID;
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
  updateProgressScrollComponent(numDone, numDoneCount);

  updateProgressScrollComponent(numTotal, numTotalCount);

  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
  progressBar.dataset.numdoing = numDoingCount;
}


/* Todo Selection */

todoWrapper.addEventListener('click', (e) => {
  console.log('selected item\'s class: ' + e.target.classList[0]);
  switch (e.target.classList[0]) {
    case 'checkbox':
      const checkboxTodoID = e.target.dataset.todoid;
      const checkboxStatus = e.target.classList[1];

      if (currentPlace !== 'Today') {
        switch (checkboxStatus) {
          case undefined:
            e.target.classList.add('doing');
            incrementNumDoing();

            linkTodoToToday(checkboxTodoID);
            break;
          case 'doing':
            e.target.classList.remove('doing');
            incrementNumDoing(true);

            unlinkTodoFromToday(checkboxTodoID);
            break;
          case 'done':
            alert('Todos are checked/unchecked in Today!')
            break;
        }
      } else {
        switch (checkboxStatus) {
          case undefined:
            e.target.classList.add('done');
            incrementNumDone();

            markTodoAsDone(checkboxTodoID);
            break;
          case 'done':
            e.target.classList.remove('done');
            incrementNumDone(true);

            markTodoAsNotDone(checkboxTodoID);
            break;
        }
      }
      break;
    case 'priority':
      const priorityTodoID = e.target.dataset.todoid;
      const priorityLevel = e.target.classList[1];
      console.log({priorityTodoID});

      switch (priorityLevel) {
        case 'normal':
          e.target.classList.remove('normal');
          e.target.classList.add('high');

          e.target.textContent = '';
          e.target.append(document.createElement('span'), 'High');

          updateTodoPriority(priorityTodoID, 3);
          break;
        case 'high':
          e.target.classList.remove('high');
          e.target.classList.add('low');

          e.target.textContent = '';
          e.target.append(document.createElement('span'), 'Low');

          updateTodoPriority(priorityTodoID, 1);
          break;
        case 'low':
          e.target.classList.remove('low');
          e.target.classList.add('normal');

          e.target.textContent = '';
          e.target.append(document.createElement('span'), 'Normal');

          updateTodoPriority(priorityTodoID, 2);
          break;
      }
  }
});


/* Progress-scroll */

// Stat Update Functions //

function updateProgressScrollComponent(component, updatedContent, increment=0) {
  if (!updatedContent && increment !== 0) {
    updatedContent = +component.textContent + increment;
  }

  if (appLoad) {
    component.textContent = updatedContent;
  } else {
    component.dataset.content = updatedContent;
    component.classList.add('crossfade');
    setTimeout(() => {
      component.textContent = updatedContent;
      component.classList.remove('crossfade');
    }, 0.5 * 1000);
  }
}

function calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount) {
  const hashtags = Math.round(numDoneCount / numTotalCount * 12);
  const asterisks = Math.round(numDoingCount / numTotalCount * 12);
  const dots = 12 - asterisks - hashtags;

  console.log({numDoneCount, numTotalCount, numDoingCount});

  return '[' + '#'.repeat(hashtags) + ':'.repeat(asterisks) + '.'.repeat(dots) + ']';
}

function incrementNumDone(decrement=false) {
  let numDoneCount = +numDone.textContent;
  numDoneCount = (decrement) ? numDoneCount - 1 : numDoneCount + 1;
  updateProgressScrollComponent(numDone, numDoneCount);

  const numTotalCount = +numTotal.textContent;
  const numDoingCount = +progressBar.dataset['numdoing'];
  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
}

function incrementNumTotal(decrement=false) {

}

function incrementNumDoing(decrement=false) {
  let numDoingCount = +progressBar.dataset['numdoing'];
  numDoingCount = (decrement) ? numDoingCount - 1 : numDoingCount + 1;
  progressBar.dataset.numdoing = numDoingCount;

  const numTotalCount = +numTotal.textContent;
  const numDoneCount = +numDone.textContent; 
  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
}

// Rollup Effect //

progressScroll.querySelector('.scroll-decor-container').addEventListener('click' , () => {
  progressScroll.classList.toggle('rollup');
});
