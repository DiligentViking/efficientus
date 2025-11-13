import '../styles/index.css';
import scrollImg from '../assets/images/scroll-outline.svg';

import { createProfile, createList, readLists } from './storage.js';
import { createTodo, readAllTodos, getLastTodoIndex, markTodoAsDone, markTodoAsNotDone, updateTodoPriority, linkTodoToToday, unlinkTodoFromToday, deleteTodo } from './todo.js';


/* Initial Population */

localStorage.clear();  // Devving

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
  createTodo(['Odin Project'], 'Do "Linting" lesson', '', null, 2);
}

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

console.table(readAllTodos());


/* Globals */

let currentPlace;

let keyboardFocusedTodo;
let activeArea = document.activeElement.tagName;
let activeModal;

const listsArray = readLists();

const overlay = document.querySelector('.overlay');

const sidebar = document.querySelector('.sidebar');
const sidebarMenu = sidebar.querySelector('.sidebar-menu');
const sidebarGroupLists = sidebar.querySelector('.sidebar-group.lists');

const contentArea = document.querySelector('.content');
const contentTitle = contentArea.querySelector('.content-title');
const progressScroll = contentArea.querySelector('.progress-scroll');
const todoWrapper = contentArea.querySelector('.todo-wrapper');

const numDone = progressScroll.querySelector('.num-done');
const numTotal = progressScroll.querySelector('.num-total');
const progressBar = progressScroll.querySelector('.progress-bar');
let numDoneCount = 0;
let numTotalCount = 0;
let numDoingCount = 0;

const addTodo = document.querySelector('.add-todo');
const newTodoModal = document.querySelector('#new-todo-modal');
const newTodoForm = document.querySelector('#new-todo-form');

const timeModal = document.querySelector('#time-modal');
const dateModal = document.querySelector('#date-modal');

let appLoad = true;


/* Sidebar */

// List loading //

for (const list of listsArray) {
  if (list === 'Today') continue;
  const sidebarItem = document.createElement('li');

  sidebarItem.setAttribute('class', 'sidebar-item');
  sidebarItem.setAttribute('tabindex', '0');
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
      renderTodoListDOM();
      appLoad = false;
      return;
    }

    toggleMobileSidebarOpen();

    contentTitle.classList.add('no-opacity');
    todoWrapper.classList.add('no-opacity');
    addTodo.classList.add('no-opacity');

    setTimeout(() => {
      renderTodoListDOM(dataList);
      contentTitle.classList.remove('no-opacity');
      todoWrapper.classList.remove('no-opacity');
      addTodo.classList.remove('no-opacity');
    }, 0.25 * 1000);
  }
});

sidebarMenu.querySelector('.sidebar-item.today').click();


/* Todo Rendering */

function renderTodoListDOM() {
  // Title //
  contentTitle.textContent = currentPlace;

  // Progress-scroll (1) //

  numDoneCount = 0;
  numTotalCount = 0;
  numDoingCount = 0;

  // Todos //
  todoWrapper.textContent = '';

  const todoArray = readAllTodos(currentPlace);

  for (const todoData of todoArray) {
    renderTodo(todoData);
    console.log({numTotalCount});
  }

  // Progress-scroll (2) //
  updateProgressScrollComponent(numDone, numDoneCount);

  updateProgressScrollComponent(numTotal, numTotalCount);

  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
  progressBar.dataset.numdoing = numDoingCount;
}

function renderTodo(todoData, create=false) {
  const todoElem = document.createElement('div');
  todoElem.classList.add('todo');
  if (create) todoElem.classList.add('create');
  todoElem.dataset.todoid = todoData.todoID;

  const checkbox = document.createElement('input');
  checkbox.classList.add('checkbox');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('tabindex', '0');
  checkbox.dataset.todoid = todoData.todoID;
  if (todoData.isDone === 1) {
    checkbox.classList.add('done');
    if (currentPlace !== 'Today') {
      checkbox.classList.add('no-hover');
    }
    numDoneCount++;
  } else if (currentPlace !== 'Today' && todoData.lists.length == 2) {  // A lil non-SRP. Also, I'll have to change this when I have templates in addition to custom lists.
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
  priority.setAttribute('tabindex', '0');
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
  datetimedue.setAttribute('tabindex', '0');
  datetimedue.dataset.todoid = todoData.todoID;
  const datetimedueIcon = document.createElement('span');
  let datetimedueText;
  if (currentPlace === 'Today') {
    datetimedue.classList.add('anytime');
    datetimedueText = 'Anytime';
    if (todoData.datetimedue) {
      datetimedue.classList.add('scheduled');
      datetimedueText = todoData.datetimedue;
    }
  } else {
    datetimedue.classList.add('anyday');
    datetimedueText = 'Anyday';
    if (todoData.datetimedue) {
      datetimedue.classList.add('scheduled');
      datetimedueText = todoData.datetimedue;
    }
  }
  datetimedue.append(datetimedueIcon, datetimedueText);

  rowGroup2.appendChild(datetimedue);

  if (currentPlace === 'Today' && todoData.lists.length == 2) {
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


/* Todo Selection & Updation */

todoWrapper.addEventListener('click', (e) => {
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
      break;
    case 'datetimedue':
      const datetimedueTodoID = e.target.dataset.todoid;
      timeModal.dataset.todoid = datetimedueTodoID;

      const datetimedueCoords = e.target.getBoundingClientRect();  // delightful

      timeModal.style.top = `${datetimedueCoords.bottom + window.scrollY}px`;
      timeModal.style.left = `${datetimedueCoords.left}px`;

      openModal(timeModal);
  }
});


/* Todo Creation */

function openModal(modal) {
  modal.showModal();
  modal.classList.add('open');
  overlay.classList.add('show');
  const editTodoDatetimedue = modal.dataset.todoid;
  if (editTodoDatetimedue) {
    overlay.classList.add('weak');
    const datetimedueTodo = todoWrapper.querySelector(`.todo[data-todoid="${editTodoDatetimedue}"]`)
    datetimedueTodo.classList.add('edit-todo-datetimedue');
    if (keyboardFocusedTodo) {
      keyboardFocusedTodo.classList.remove('keyboard-hover');
    }
  }
  activeArea = 'MODAL';
  activeModal = modal;
}

function closeModal(modal) {
  modal.classList.remove('open');
  overlay.classList.remove('show');
  const editTodoDatetimedue = modal.dataset.todoid;
  const delay = (editTodoDatetimedue) ? 0.25 : 0.5;
  setTimeout(() => {
    modal.close();
    if (editTodoDatetimedue) {
      const datetimedueTodo = todoWrapper.querySelector(`.todo[data-todoid="${editTodoDatetimedue}"]`);
      datetimedueTodo.classList.remove('edit-todo-datetimedue');
      datetimedueTodo.classList.add('keyboard-hover');
      keyboardFocusedTodo = datetimedueTodo;
      overlay.classList.remove('weak');
    }
    activeArea = 'CONTENT';
    activeModal = null;
  }, delay * 1000);
}

addTodo.addEventListener('click', () => {
  openModal(newTodoModal);
});

newTodoModal.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeModal(newTodoModal);
});
timeModal.addEventListener('cancel', (e) => {
  e.preventDefault();
  console.log({activeElem: document.activeElement});
  closeModal(timeModal);
});

window.addEventListener('click', (e) => {
  if (e.target.tagName === 'HTML' && activeModal) {
    closeModal(activeModal);
  }
});

newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoData = {
    lists: [currentPlace],
    description: newTodoForm.querySelector('#title').value,
    notes: newTodoForm.querySelector('#notes').value,
    datetimedue: null,
    priority: 2
  };

  createTodo(...Object.values(todoData));

  todoData['todoID'] = getLastTodoIndex();
  
  closeModal(newTodoModal);
  
  setTimeout(() => {
    renderTodo(todoData, currentPlace, true);
  
    incrementNumTotal();

    addTodo.classList.add('push-down');
  }, 0.00 * 1000);

  setTimeout(() => {
    addTodo.classList.remove('push-down');

    newTodoForm.querySelector('#title').value = '';
    newTodoForm.querySelector('#notes').value = '';
  }, 0.5 * 1000);
});


/* Progress-scroll */

// Stat Update Functions //

function updateProgressScrollComponent(component, updatedContent) {
  if (appLoad) {
    component.textContent = updatedContent;
    return;
  }
  component.dataset.content = updatedContent;
  component.classList.add('crossfade');
  setTimeout(() => {
    component.textContent = updatedContent;
    component.classList.remove('crossfade');
  }, 0.5 * 1000);
}

function incrementNumDone(decrement=false) {
  numDoneCount = (decrement) ? numDoneCount - 1 : numDoneCount + 1;
  updateProgressScrollComponent(numDone, numDoneCount);
  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
}

function incrementNumTotal(decrement=false) {
  // numTotalCount = (decrement) ? numTotalCount -1 : numTotalCount + 1;
  console.log({numTotalCount});
  updateProgressScrollComponent(numTotal, numTotalCount);
  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));

}

function incrementNumDoing(decrement=false) {
  numDoingCount = (decrement) ? numDoingCount - 1 : numDoingCount + 1;
  updateProgressScrollComponent(progressBar, calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount));
}

function calculateProgressBarContent(numDoneCount, numTotalCount, numDoingCount) {
  const hashtags = Math.round(numDoneCount / numTotalCount * 12);
  const asterisks = Math.round(numDoingCount / numTotalCount * 12);
  const dots = 12 - asterisks - hashtags;

  return '[' + '#'.repeat(hashtags) + ':'.repeat(asterisks) + '.'.repeat(dots) + ']';
}

// Rollup Effect //

progressScroll.querySelector('.scroll-decor-container').addEventListener('click' , () => {
  progressScroll.classList.toggle('rollup');
});


/* Keyboard Navigation */

// Moving with Tabs and Arrows //

function resetKeyboardFocus() {
  activeArea = 'BODY';
  document.body.focus();
}

function moveToNextTabIndex(areaNode, moveBy=1) {
  const allTabbableElems = areaNode.querySelectorAll('[tabindex="0"]');

  const indexOfFocusedElem = Array.from(allTabbableElems).indexOf(document.activeElement);

  const elemToFocus = allTabbableElems[indexOfFocusedElem + moveBy];

  if (elemToFocus) {
    elemToFocus.focus();
  }
}

window.addEventListener('keydown', (e) => {
  console.log(activeArea);
  if (activeArea === 'MODAL') return;
  switch (e.key) {
    case 'Tab':
      if (e.key !== 'Tab') return;

      e.preventDefault();

      switch (activeArea) {
        case 'SIDEBAR':
          activeArea = 'CONTENT';
          keyboardFocusedTodo = contentArea.querySelector('.todo');
          keyboardFocusedTodo.classList.add('keyboard-hover');
          keyboardFocusedTodo.querySelector('.checkbox').focus();
          break;
        case 'CONTENT':
          activeArea = 'SIDEBAR';
          keyboardFocusedTodo.classList.remove('keyboard-hover');
          sidebar.querySelector('.today').focus();
          break;
        default:
          activeArea = 'SIDEBAR';
          sidebar.querySelector('.today').focus();
      }
      break;
    case 'ArrowDown':
      switch (activeArea) {
        case 'BODY':
          activeArea = 'SIDEBAR';
          sidebar.querySelector('.today').focus();
          break;
        case 'SIDEBAR':
          e.preventDefault();
          moveToNextTabIndex(sidebar);
          break;
        case 'CONTENT':
          const todoID = +document.activeElement.dataset.todoid;
          keyboardFocusedTodo = contentArea.querySelector(`.todo[data-todoid="${todoID}"]`);
          const nextTodo = keyboardFocusedTodo.nextSibling;
          if (nextTodo) {
            keyboardFocusedTodo.classList.remove('keyboard-hover');
            const focusedTodoElem = document.activeElement.classList[0];
            nextTodo.querySelector(`.${focusedTodoElem}`).focus();
            nextTodo.classList.add('keyboard-hover');
            keyboardFocusedTodo = nextTodo;
          }
          break;
      }
      break;
    case 'ArrowUp':
      switch (activeArea) {
        case 'BODY':
          activeArea = 'SIDEBAR';
          sidebar.querySelector('.today').focus();
          break;
        case 'SIDEBAR':
          e.preventDefault();
          moveToNextTabIndex(sidebar, -1);
          break;
        case 'CONTENT':
          const todoID = +document.activeElement.dataset.todoid;
          keyboardFocusedTodo = contentArea.querySelector(`.todo[data-todoid="${todoID}"]`);
          const prevTodo = keyboardFocusedTodo.previousSibling;  // Only difference from ArrowDown version
          if (prevTodo) {
            keyboardFocusedTodo.classList.remove('keyboard-hover');
            const focusedTodoElem = document.activeElement.classList[0];
            prevTodo.querySelector(`.${focusedTodoElem}`).focus();
            prevTodo.classList.add('keyboard-hover');
            keyboardFocusedTodo = prevTodo;
          }
          break;
      }
      break;
    case 'ArrowRight':
      switch (activeArea) {
        case 'SIDEBAR':
          break;
        case 'CONTENT':
          const todoID = +document.activeElement.dataset.todoid;
          const todo = contentArea.querySelector(`.todo[data-todoid="${todoID}"`);
          moveToNextTabIndex(todo);
          break;
      }
      break;
    case 'ArrowLeft':
      switch (activeArea) {
        case 'SIDEBAR':
          break;
        case 'CONTENT':
          const todoID = +document.activeElement.dataset.todoid;
          const todo = contentArea.querySelector(`.todo[data-todoid="${todoID}"`);
          moveToNextTabIndex(todo, -1);
          break;
      }
      break;
    case 'Enter':
      e.preventDefault();
      break;
    case ' ':
      e.preventDefault();
      break;
    case 'Escape':
      resetKeyboardFocus();
      if (keyboardFocusedTodo) {
        keyboardFocusedTodo.classList.remove('keyboard-hover');
      }
      break;
    // Keyboard Shortcuts //
    case 'T':
      e.preventDefault();
      openModal(newTodoModal);
      break;
    }
});

window.addEventListener('click', (e) => {
  if (activeArea === 'MODAL') return;
  if (e.target.dataset.list) {
    activeArea = 'SIDEBAR';
  } else if (e.target.dataset.todoid) {
    activeArea = 'CONTENT';
  } else {
    if (e.target.getAttribute('tabindex')) return;
    resetKeyboardFocus();
  }
  if (keyboardFocusedTodo) {
    keyboardFocusedTodo.classList.remove('keyboard-hover');
  }
});

window.addEventListener('keyup', (e) => {
  if (activeArea === 'MODAL') {
    if (e.key === 'Enter') {
      setTimeout(() => {
        const createdTodo = todoWrapper.querySelector('.todo:last-child');
        createdTodo.querySelector('.checkbox').focus();
        moveToNextTabIndex(createdTodo);
        createdTodo.classList.add('keyboard-hover');
        if (keyboardFocusedTodo) {
          keyboardFocusedTodo.classList.remove('keyboard-hover');
        }
        keyboardFocusedTodo = createdTodo;
      }, 0.5 * 1000);
    }
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    document.activeElement.click();
  }
});


/* Other (Small Things) */

// Sidebar Button for Mobile //

document.querySelector('.sidebar-button').addEventListener('click', toggleMobileSidebarOpen)

function toggleMobileSidebarOpen() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('sidebar-open');
  setTimeout(() => {
    sidebar.classList.toggle('anti-janky-width');
  }, 0.5 * 1000)
  document.querySelector('.sidebar-button').classList.toggle('open');
}

// Auto-resizing Textarea //

const textarea = document.querySelector('textarea');

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
});
