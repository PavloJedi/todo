import { renderTaskList, renderListPopup, setupUI } from "./ui.js";
import {
  saveTaskList,
  loadTaskList,
  saveListManager,
  loadListManager,
} from "./storage.js";
import Task from "./Task.js";
import TaskList from "./TaskList.js";
import ListManager from "./listManager.js";

const taskList = new TaskList();
const listManager = new ListManager(loadListManager());

const taskInput = document.getElementById("newTaskInput");
const taskForm = document.getElementById("addTaskForm");

taskList.setTasks(
  loadTaskList().map(
    (t) => new Task(t.id, t.text, t.isCompleted, t.listId, t.deleted, t.dueDate)
  )
);

renderTaskList(taskList.getTasks(), listManager);
renderListPopup(listManager, taskList);

const handleTaskFormSubmit = (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    const activeList = listManager.getActiveList();
    const listId = activeList ? activeList.id : null;
    taskList.addTask(new Task(Date.now(), text, false, listId, false, null));
    saveTaskList(taskList.getTasks());
    renderTaskList(taskList.getTasks(), listManager);
    taskInput.value = "";
  }
};

taskForm.addEventListener("submit", handleTaskFormSubmit);

setupUI(taskList, listManager);
