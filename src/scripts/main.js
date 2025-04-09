import Task from "./Task.js";
import TaskList from "./TaskList.js";
import ListManager from "./listManager.js";
import { saveTaskList, loadTaskList } from "./storage.js";
import { setupUI, renderTaskList } from "./ui.js";

const taskList = new TaskList();
const listManager = new ListManager();

const taskInput = document.getElementById("newTaskInput");
const taskForm = document.getElementById("addTaskForm");

taskList.setTasks(
  loadTaskList().map(
    (t) => new Task(t.id, t.text, t.isCompleted, t.listId, t.deleted, t.dueDate)
  )
);

renderTaskList(taskList.getTasks(), listManager);

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    taskList.addTask(new Task(Date.now(), text, false, null, false, null));
    renderTaskList(taskList.getTasks(), listManager);
    taskInput.value = "";
    saveTaskList(taskList.getTasks());
  }
});

setupUI(taskList, listManager);
