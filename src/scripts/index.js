import '../styles/index.css';
import odinImage from '../assets/images/odin.svg';  // If you want to set the image in JS

import { createTodo, readTodo, readAllTodos, updateTodo, deleteTodo } from './todo.js';

console.log(`
---------------
~~Efficientus~~
---------------`
+ '\n\n');

localStorage.clear();

createTodo(['today'], 'Feed all of the scats', '2025', 5);
createTodo(['today', 'tomorrow'], 'Pickleball with S at the park.', '2025', 3);
createTodo(['tomorrow'], 'Finish v1.0 of Todo app.', '2025', 7);

readTodo(2);

console.table(readAllTodos());
