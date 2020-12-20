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

    moveItem(elem, drawFn, distance) {
        elem.style.zIndex = 99;
        let start = null,
            currentPos = 0,
            id;

        const step = timestamp => {
            if (!start) { start = timestamp; }
            const progress = timestamp - start;
            currentPos = drawFn(elem, currentPos, progress);

            if (Math.abs(currentPos) <= Math.abs(distance)) {
                id = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(id);
                this.render();
            }
        };
        id = requestAnimationFrame(step);
    }

    drawUp(elem, currentTop, progress) {
        elem.style.top = `${currentTop}px`;
        return currentTop -= Math.floor((progress / 100) / 2);
    }

    drawDown(elem, currentTop, progress) {
        elem.style.top = `${currentTop}px`;
        return currentTop += Math.floor((progress / 100) / 2);
    }

    drawRight(elem, currentPos, progress) {
        elem.style.transform = `translateX(${currentPos}%)`;
        return currentPos += Math.floor((progress / 100) / 10);
    }

    rmTask(target) {
        const taskItem = target.closest('.todo-item');
        this.taskList.forEach(task => {
            if (task.value === taskItem.textContent.trim()) {
                this.taskList.delete(task.key);
                this.moveItem(taskItem, this.drawRight, 110);
            }
        });
    }

    completeTask(target) {
        const taskItem = target.closest('.todo-item');

        this.taskList.forEach(task => {
            if (task.value === taskItem.textContent.trim()) {
                if (!task.done) {
                    task.done = true;
                    const destDn = this.doneList.getBoundingClientRect().bottom + 12,
                        distDn = destDn - taskItem.getBoundingClientRect().top;
                    this.moveItem(taskItem, this.drawDown, distDn);
                } else {
                    task.done = false;
                    const destUp = this.todoList.getBoundingClientRect().bottom + 12,
                        distUp = destUp - taskItem.getBoundingClientRect().top;
                    this.moveItem(taskItem, this.drawUp, distUp);
                }
            }
        }); // end forEach
    }

    editTask(target) {
        const taskItem = target.closest('.todo-item'),
            taskText = taskItem.firstChild.nextSibling,
            isEdit = taskText.getAttribute('contenteditable');
        if (!isEdit) {
            this.taskList.forEach(task => {
                if (task.value === taskText.textContent.trim()) {
                    this.isEditKey = task.key;
                }
                taskText.setAttribute('contenteditable', true);
                target.classList.add('todo-refresh');
            });
        } else {
            taskText.removeAttribute('contenteditable');
            target.classList.remove('todo-refresh');
            this.taskList.get(this.isEditKey).value = taskText.textContent;
            this.render();
        } // end if
    } // end editTask

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
