import '../styles/index.css';

import { createProfile } from './storage.js';
import { createTodo, readAllTodos, updateTodo, deleteTodo } from './todo.js';

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

createProfile();

createTodo(['today'], 'Feed all of the scats', '2025', 5);
createTodo(['today', 'tomorrow'], 'Pickleball with S at the park.', '2025', 3);
createTodo(['tomorrow'], 'Finish v1.0 of Todo app.', '2025', 7);

;

console.table(readAllTodos());
