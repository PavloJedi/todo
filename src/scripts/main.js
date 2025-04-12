import Task from "./Task.js";
import TaskList from "./TaskList.js";
import ListManager from "./listManager.js";
import {
  saveTaskList,
  loadTaskList,
  saveListManager,
  loadListManager,
} from "./storage.js";
import { setupUI, renderTaskList, renderListPopup } from "./ui.js";

const taskList = new TaskList();
const listManager = new ListManager(loadListManager()); // Load lists from LocalStorage

const taskInput = document.getElementById("newTaskInput");
const taskForm = document.getElementById("addTaskForm");

taskList.setTasks(
  loadTaskList().map(
    (t) => new Task(t.id, t.text, t.isCompleted, t.listId, t.deleted, t.dueDate)
  )
);

renderTaskList(taskList.getTasks(), listManager);
renderListPopup(listManager, taskList);

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    const activeList = listManager.getActiveList();
    const listId = activeList ? activeList.id : null; // Assign to active list or null
    taskList.addTask(new Task(Date.now(), text, false, listId, false, null));
    saveTaskList(taskList.getTasks());
    renderTaskList(taskList.getTasks(), listManager);
    taskInput.value = "";
  }
});

setupUI(taskList, listManager);
renderListPopup(listManager, taskList); // Pass both listManager and taskList
