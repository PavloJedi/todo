import { saveTaskList } from "./storage.js";

const taskListElement = document.getElementById("taskList");
const clearButton = document.querySelector(".todo__clear-completed");
const filterButtons = document.querySelectorAll(".todo__filter-btn");

export const renderTaskList = (tasks, listManager) => {
  taskListElement.innerHTML = "";
  const activeList = listManager.getActiveList();
  tasks = activeList
    ? tasks.filter((t) => t.listId === activeList.id && !t.deleted)
    : tasks.filter((t) => !t.deleted);
  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `todo__item ${task.isCompleted ? "completed" : ""}`;
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", () => {
      task.isCompleted = checkbox.checked;
      saveTaskList(tasks);
      renderTaskList(tasks, listManager);
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "task-delete-btn";
    deleteButton.addEventListener("click", () => {
      task.deleted = true;
      saveTaskList(tasks);
      renderTaskList(tasks, listManager);
    });

    item.append(checkbox, text, deleteButton);
    taskListElement.appendChild(item);
  });
};

const applyFilter = (filter, tasks, listManager) => {
  const filteredTasks =
    filter === "active"
      ? tasks.filter((t) => !t.isCompleted)
      : filter === "completed"
      ? tasks.filter((t) => t.isCompleted)
      : tasks;
  renderTaskList(filteredTasks, listManager);
};

export const setupUI = (taskList, listManager) => {
  filterButtons.forEach((button) =>
    button.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.dataset.filter, taskList.getTasks(), listManager);
    })
  );

  clearButton.addEventListener("click", () => {
    taskList.setTasks(taskList.getTasks().filter((t) => !t.isCompleted));
    saveTaskList(taskList.getTasks());
    renderTaskList(taskList.getTasks(), listManager);
  });
};
