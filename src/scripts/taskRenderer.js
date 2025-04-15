import { taskListElement, updateTaskCount } from "./ui.js";
import { saveTaskList } from "./storage.js";

const renderTaskList = (tasks, listManager, filter = "all") => {
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
      const dueDateContainer = document.createElement("div");
      dueDateContainer.className = "due-date-options";
      const todayButton = document.createElement("button");
      todayButton.className = "due-date-btn";
      todayButton.textContent = "Today";
      todayButton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        task.dueDate = new Date().toISOString().split("T")[0];
        saveTaskList(tasks);
        renderTaskList(tasks, listManager, filter);
      });
      const tomorrowButton = document.createElement("button");
      tomorrowButton.className = "due-date-btn";
      tomorrowButton.textContent = "Tomorrow";
      tomorrowButton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        task.dueDate = tomorrow.toISOString().split("T")[0];
        saveTaskList(tasks);
        renderTaskList(tasks, listManager, filter);
      });
      const customDateButton = document.createElement("button");
      customDateButton.className = "due-date-btn";
      customDateButton.textContent = "📅";
      customDateButton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (dueDateContainer.querySelector(".due-date-picker")) return;
        const datePicker = document.createElement("input");
        datePicker.type = "date";
        datePicker.className = "due-date-picker";
        datePicker.value = task.dueDate || "";
        datePicker.addEventListener("change", (e2) => {
          task.dueDate = e2.target.value;
          saveTaskList(tasks);
          renderTaskList(tasks, listManager, filter);
        });
        dueDateContainer.appendChild(datePicker);
        setTimeout(() => {
          datePicker.showPicker ? datePicker.showPicker() : datePicker.focus();
        }, 0);
      });
      dueDateContainer.append(todayButton, tomorrowButton, customDateButton);
      item.appendChild(dueDateContainer);
    });

    // Show selected date as plain text if set
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

export { renderTaskList };
