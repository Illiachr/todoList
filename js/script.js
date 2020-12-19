'use strict';

class ToDo {
    constructor(form, input, todoList, doneList) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.doneList = document.querySelector(doneList);
        this.taskArea = document.querySelector('.todo-container');
        this.taskDbKey = 'taskDb';
        this.isEditKey = '';
        this.taskList = new Map(JSON.parse(localStorage.getItem(this.taskDbKey)));
    }

    keyGen() {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }

    saveTask() {
        localStorage[this.taskDbKey] = JSON.stringify([...this.taskList]);
    }

    createTask(task) {
        const elem = document.createElement('li');
        elem.classList.add('todo-item');
        elem.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${task.value}</span>
        <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (task.done) {
            this.doneList.append(elem);
        } else {
            this.todoList.append(elem);
        }
        this.input.value = '';
    } // end createTask

    render() {
        this.todoList.textContent = '';
        this.doneList.textContent = '';
        this.taskList.forEach(task => this.createTask(task));
        this.saveTask();
    } // end render

    addTask(e) {
        e.preventDefault();
        console.log(this);
        const inputVal = this.input.value.trim();
        if (inputVal) {

            const newTask = {
                key: this.keyGen(),
                value: inputVal,
                done: false
            };

            this.taskList.set(newTask.key, newTask);
            this.render();
            this.input.setAttribute('placeholder', 'Какие планы?');
        } else {
            this.input.setAttribute('placeholder', 'Введите текст задачи...');
        } // end if
    } // end addTask

    rmTask(target) {
        this.taskList.forEach(task => {
            if (task.value === target.closest('.todo-item').textContent.trim()) {
                this.taskList.delete(task.key);
            }
        });
        this.render();
    }

    completeTask(target) {
        this.taskList.forEach(task => {
            if (task.value === target.closest('.todo-item').textContent.trim()) {
                if (!task.done) {
                    task.done = true;
                } else { task.done = false; }
            }
        });
        this.render();
    }

    editTask(target) {
        console.log(target.closest('.todo-item').firstChild.nextSibling);
        const taskItem = target.closest('.todo-item'),
            taskItemSpan = taskItem.firstChild.nextSibling,
            isEdit = taskItemSpan.getAttribute('contenteditable');
        console.log(isEdit);
        if (!isEdit) {            
            this.taskList.forEach(task => {
                if (task.value === taskItemSpan.textContent.trim()) {
                    this.isEditKey = task.key;
                    console.log(this.isEditKey);
                }
                taskItemSpan.setAttribute('contenteditable', true);
            });
        } else {
            const edit = this.isEditKey;
            taskItemSpan.removeAttribute('contenteditable');
            console.log(this.isEditKey);
            console.log(this.taskList.get(this.isEditKey).value);
            this.taskList.get(this.isEditKey).value = taskItemSpan.textContent;
            this.render();
        }

        console.log(taskItemSpan.getAttribute('contenteditable'));
    }

    handler(e) {
        const target = e.target;
        if (target.matches('.todo-complete')) {
            this.completeTask(target);
        } else if (target.matches('.todo-remove')) {
            this.rmTask(target);
        } else if (target.matches('.todo-edit')) {
            this.editTask(target);
        }
    }

    init() {
        this.form.addEventListener('submit', e => this.addTask(e));
        this.taskArea.addEventListener('click', e => this.handler(e));
        this.render();
    }
}

const toDo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
toDo.init();
