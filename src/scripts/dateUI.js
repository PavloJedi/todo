import { saveTaskList } from "./storage.js";
import { renderTaskList } from "./taskRenderer.js";

const renderDueDateOptions = (task, tasks, listManager) => {
  const existingPicker = document.querySelector(
    `.todo__item[data-id='${task.id}'] .due-date-options`
  );
  if (existingPicker) {
    existingPicker.remove();
    return;
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
      return;
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

export { renderDueDateOptions, renderDueDateLabel };
