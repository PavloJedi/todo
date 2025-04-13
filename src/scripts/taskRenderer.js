import { taskListElement, updateTaskCount } from "./ui.js";
import { renderDueDateLabel } from "./dateUI.js";
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

    const dueDateLabel = renderDueDateLabel(task, tasks, listManager);
    if (dueDateLabel) {
      taskContent.appendChild(dueDateLabel);
    }

    item.append(taskContent);
    taskListElement.appendChild(item);
  });
  updateTaskCount(tasks);
};

export { renderTaskList };
