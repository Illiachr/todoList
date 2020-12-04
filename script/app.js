document.addEventListener('DOMContentLoaded', () =>
{
    'use strict';

    const todoControl = document.querySelector('.todo-control'),
        headerInput = document.querySelector('.header-input'),
        headerButton = document.querySelector('.header-button'),
        todoList = document.querySelector('.todo-list'),
        todoButtons = document.querySelectorAll('.todo-buttons'),
        todoRemove = document.querySelector('.todo-remove'),
        todoComplete = document.querySelector('.todo-complete');

    const todoData = [
        {
            value :'Сварить кофе',
            completed : false
        },
        {
            value : 'Помыть посуду',
            completed : true
        }
    ];

    const render = () => {
        console.log(todoData);
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