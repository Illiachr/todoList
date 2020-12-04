document.addEventListener('DOMContentLoaded', () =>
{
    'use strict';

    const todoControl = document.querySelector('.todo-control'),
        headerInput = document.querySelector('.header-input'),
        todoList = document.querySelector('.todo-list'),
        todoButtons = document.querySelectorAll('.todo-buttons'),
        todoRemove = document.querySelector('.todo-remove'),
        todoCompleted = document.querySelector('.todo-completed');

    let todoData = [];
    if(localStorage.getItem('db') !== null) {
        todoData = JSON.parse(localStorage.getItem('db'));
    }

    const render = () => {
        todoList.textContent = '';
        todoCompleted.textContent = '';

        todoData.forEach(item => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            todoItem.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
            '<div class="todo-buttons">' + 
                '<button class="todo-remove"></button>' +
                '<button class="todo-complete"></button>' +
            '</div>';
            if (item.completed) {
                todoCompleted.append(todoItem);
            } else {
                todoList.append(todoItem);
            }
            const btnTodoComplete = todoItem.querySelector('.todo-complete');
            btnTodoComplete.addEventListener('click', () => {
                item.completed = !item.completed;
                render();
            });

            const btnTodoRemove = todoItem.querySelector('.todo-remove');
            btnTodoRemove.addEventListener('click', () => {                
                let rmItem = todoData.findIndex(item => item.value === todoItem.textContent);
                console.log(todoData[rmItem]);
                todoData.splice(rmItem, 1);
                render();
            });
        });

        

        let json = JSON.stringify(todoData);
        localStorage.setItem('db', json);
        //console.log(json);
        headerInput.value = '';
    };

    todoControl.addEventListener('submit', event => {
        event.preventDefault();

        if (headerInput.value.trim() !== '') {
            const newTodo = {
            value : headerInput.value,
            completed: false
            };

            todoData.push(newTodo);

            render();
        } else {
            alert('Планы должны быть точнее! Введите наименование!');
        }
    });
});