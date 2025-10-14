import '../styles/index.css';

import { createProfile, createList, readLists } from './storage.js';
import { createTodo, readAllTodos, updateTodo, deleteTodo } from './todo.js';

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

localStorage.clear();
createProfile();

createList('today');
createList('odin project');

createTodo(['today'], 'Feed all of the scats', '2025', 5);
createTodo(['today'], 'Pickleball with S at the park.', '2025', 3);
createTodo(['today', 'odin project'], 'Finish v1.0 of Todo app.', '2025', 7);
createTodo(['odin project'], 'Do "Linting" lesson.', '', 1);

;

console.table(readAllTodos());
// console.table(readLists());


/* Dom Stuff */


