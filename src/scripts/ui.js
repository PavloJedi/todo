import { saveTaskList } from "./storage.js";
import { renderDueDateOptions } from "./dateUI.js";
import { renderListPopup } from "./listUI.js";

const taskListElement = document.getElementById("taskList");
const clearButton = document.querySelector(".todo__clear-completed");
const filterButtons = document.querySelectorAll(".todo__filter-btn");
const taskCount = document.getElementById("taskCount");
const listPopup = document.getElementById("taskListPopup");
const allButton = document.querySelector(".todo__filter-btn--active");

function updateTaskCount(tasks) {
  const remaining = tasks.filter((t) => !t.isCompleted && !t.deleted).length;
  taskCount.textContent = `${remaining} tasks remaining`;
}

export const renderTaskList = (tasks, listManager, filter = "all") => {
  taskListElement.innerHTML = "";
  const activeList = listManager.getActiveList();
  tasks = activeList
    ? tasks.filter((t) => t.listId === activeList.id && !t.deleted)
    : tasks.filter((t) => !t.deleted);

  const filteredTasks =
    filter === "active"
      ? tasks.filter((t) => !t.isCompleted && !t.deleted)
      : filter === "completed"
      ? tasks.filter((t) => t.isCompleted)
      : tasks.filter((t) => !t.isCompleted && !t.deleted);

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
      renderTaskList(tasks, listManager, filter);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";
    taskContent.append(checkbox, text);

    item.append(taskContent);
    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("task-checkbox")) return;
      if (item.querySelector(".due-date-options")) return;
      const dueDateOptions = renderDueDateOptions(task, tasks, listManager);
      if (dueDateOptions) item.appendChild(dueDateOptions);
    });

    if (task.dueDate) {
      const dateText = document.createElement("span");
      dateText.className = "task-date-text styled-date-pill";
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];
      if (task.dueDate === today) {
        dateText.textContent = "Today";
      } else if (task.dueDate === tomorrowDate) {
        dateText.textContent = "Tomorrow";
      } else {
        const options = { month: "short", day: "numeric", year: "numeric" };
        dateText.textContent = new Date(task.dueDate).toLocaleDateString(
          "en-US",
          options
        );
      }
      taskContent.appendChild(dateText);
    }

    taskListElement.appendChild(item);
  });
  updateTaskCount(tasks);
};

export const setupUI = (taskList, listManager) => {
  allButton.addEventListener("click", () => {
    listPopup.style.display =
      listPopup.style.display === "block" ? "none" : "block";
    renderListPopup(listManager, taskList);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.dataset.filter, taskList.getTasks(), listManager);
    });
  });

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

export const applyFilter = (filter, tasks, listManager) => {
  const filteredTasks =
    filter === "active"
      ? tasks.filter((t) => !t.isCompleted && !t.deleted)
      : filter === "completed"
      ? tasks.filter((t) => t.isCompleted)
      : tasks.filter((t) => !t.isCompleted && !t.deleted);
  renderTaskList(filteredTasks, listManager, filter);
};

export {
  taskListElement,
  clearButton,
  filterButtons,
  taskCount,
  listPopup,
  allButton,
  updateTaskCount,
};
