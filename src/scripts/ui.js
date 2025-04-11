import { saveTaskList } from "./storage.js";

const taskListElement = document.getElementById("taskList");
const clearButton = document.querySelector(".todo__clear-completed");
const filterButtons = document.querySelectorAll(".todo__filter-btn");

export const renderTaskList = (tasks, listManager, filter = "all") => {
  taskListElement.innerHTML = "";
  const activeList = listManager.getActiveList();
  tasks = activeList
    ? tasks.filter((t) => t.listId === activeList.id && !t.deleted)
    : tasks.filter((t) => !t.deleted);

  const filteredTasks =
    filter === "active"
      ? tasks.filter((t) => !t.isCompleted)
      : filter === "completed"
      ? tasks.filter((t) => t.isCompleted)
      : tasks.filter((t) => !t.isCompleted);

  filteredTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `todo__item ${task.isCompleted ? "completed" : ""}`;
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.dataset.id = task.id;
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", () => {
      task.isCompleted = checkbox.checked;
      saveTaskList(tasks);
      const activeFilterButton = document.querySelector(
        ".todo__filter-btn.active"
      );
      const activeFilter = activeFilterButton
        ? activeFilterButton.dataset.filter
        : "all";
      renderTaskList(tasks, listManager, activeFilter);
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "task-delete-btn";
    deleteButton.addEventListener("click", () => {
      task.deleted = true;
      saveTaskList(tasks);
      const activeFilterButton = document.querySelector(
        ".todo__filter-btn.active"
      );
      const activeFilter = activeFilterButton
        ? activeFilterButton.dataset.filter
        : "all";
      renderTaskList(tasks, listManager, activeFilter);
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
      : tasks.filter((t) => !t.isCompleted);
  renderTaskList(filteredTasks, listManager, filter);
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
    renderTaskList(taskList.getTasks(), listManager, "active");
  });

  taskListElement.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-checkbox")) {
      const taskId = event.target.dataset.id;
      const task = taskList.getTasks().find((t) => t.id === taskId);
      if (task) {
        task.isCompleted = event.target.checked;
        saveTaskList(taskList.getTasks());
        const activeFilterButton = document.querySelector(
          ".todo__filter-btn.active"
        );
        const activeFilter = activeFilterButton
          ? activeFilterButton.dataset.filter
          : "all";
        renderTaskList(taskList.getTasks(), listManager, activeFilter);
      }
    }
  });
};
