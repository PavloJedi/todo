import { saveTaskList, saveListManager } from "./storage.js";

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

const renderDueDateOptions = (task, tasks, listManager) => {
  const existingPicker = document.querySelector(
    `.todo__item[data-id='${task.id}'] .due-date-options`
  );
  if (existingPicker) {
    existingPicker.remove();
    return; // Toggle logic: remove if already exists
  }

  const dueDateContainer = document.createElement("div");
  dueDateContainer.className = "due-date-options";

  const todayButton = document.createElement("button");
  todayButton.className = "due-date-btn";
  todayButton.textContent = "Today";
  todayButton.addEventListener("click", () => {
    task.dueDate = new Date().toISOString().split("T")[0];
    saveTaskList(tasks);
    renderTaskList(tasks, listManager);
  });

  const tomorrowButton = document.createElement("button");
  tomorrowButton.className = "due-date-btn";
  tomorrowButton.textContent = "Tomorrow";
  tomorrowButton.addEventListener("click", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    task.dueDate = tomorrow.toISOString().split("T")[0];
    saveTaskList(tasks);
    renderTaskList(tasks, listManager);
  });

  const customDateButton = document.createElement("button");
  customDateButton.className = "due-date-btn";
  customDateButton.textContent = "📅";
  customDateButton.addEventListener("click", () => {
    const existingDatePicker =
      dueDateContainer.querySelector(".due-date-picker");
    if (existingDatePicker) {
      existingDatePicker.remove();
      return; // Toggle logic: remove if already exists
    }

    const datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.className = "due-date-picker";
    datePicker.addEventListener("change", (e) => {
      task.dueDate = e.target.value;
      saveTaskList(tasks);
      renderTaskList(tasks, listManager);
    });
    dueDateContainer.appendChild(datePicker);
    datePicker.click();
  });

  dueDateContainer.append(todayButton, tomorrowButton, customDateButton);
  return dueDateContainer;
};

const renderDueDateLabel = (task, tasks, listManager) => {
  const dueDateLabel = document.createElement("span");
  dueDateLabel.className = "task-due-date-pill";

  if (task.dueDate) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    if (task.dueDate === today) {
      dueDateLabel.textContent = "Today";
    } else if (task.dueDate === tomorrowDate) {
      dueDateLabel.textContent = "Tomorrow";
    } else {
      const options = { month: "short", day: "numeric", year: "numeric" };
      dueDateLabel.textContent = new Date(task.dueDate).toLocaleDateString(
        "en-US",
        options
      );
    }
  }

  dueDateLabel.addEventListener("click", () => {
    const taskElement = document.querySelector(
      `.todo__item[data-id='${task.id}']`
    );
    const existingOptions = taskElement.querySelector(".due-date-options");
    if (existingOptions) {
      existingOptions.remove();
    } else {
      const dueDateOptions = renderDueDateOptions(task, tasks, listManager);
      taskElement.appendChild(dueDateOptions);
    }
  });

  return dueDateLabel;
};

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

    const dueDateLabel = renderDueDateLabel(task, tasks, listManager);
    if (dueDateLabel) {
      taskContent.appendChild(dueDateLabel);
    }

    item.append(taskContent);
    taskListElement.appendChild(item);
  });
  updateTaskCount(tasks);
};

export const renderListPopup = (listManager, taskList) => {
  const popupList = listPopup.querySelector(".popup__list");
  popupList.innerHTML = "";

  listManager.list.forEach((list) => {
    const item = document.createElement("li");
    item.className = `popup__item ${list.active ? "popup__item--active" : ""}`;
    item.textContent = list.name;

    item.addEventListener("click", () => {
      listManager.setActiveList(list.id);
      saveListManager(listManager);
      renderTaskList(taskList.getTasks(), listManager);
      renderListPopup(listManager, taskList);
      updateActiveListButton(list.name);
      listPopup.style.display = "none";
    });

    const deleteIcon = document.createElement("button");
    deleteIcon.innerHTML = "&times;";
    deleteIcon.className = "list-delete-btn";
    deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActiveList = list.active;
      listManager.list = listManager.list.filter((l) => l.id !== list.id);
      saveListManager(listManager);
      if (isActiveList) {
        listManager.setActiveList(null);
        updateActiveListButton("All");
      }
      renderListPopup(listManager, taskList);
      renderTaskList(taskList.getTasks(), listManager);
    });

    item.appendChild(deleteIcon);
    popupList.appendChild(item);
  });

  const createButton = listPopup.querySelector(".popup__create-btn");
  if (!createButton.dataset.listenerAdded) {
    createButton.dataset.listenerAdded = "true";
    createButton.addEventListener("click", () => {
      createButton.style.display = "none";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "New list name";
      input.className = "popup__create-input";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const listName = input.value.trim();
          if (listName) {
            const newList = listManager.createList(listName);
            listManager.setActiveList(newList.id);
            saveListManager(listManager);
            renderTaskList(taskList.getTasks(), listManager);
            updateActiveListButton(listName);
            renderListPopup(listManager, taskList);
            listPopup.style.display = "none";
          }
          listPopup.removeChild(input);
          createButton.style.display = "block";
        }
      });
      listPopup.appendChild(input);
      input.focus();
    });
  }
};

const updateActiveListButton = (listName) => {
  allButton.textContent = listName;
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
