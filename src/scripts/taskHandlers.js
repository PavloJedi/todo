import { saveTaskList } from "./storage.js";
import { renderTaskList } from "./taskRenderer.js";

const handleTaskCheckboxChange = (event, tasks, listManager, filter) => {
  if (event.target.classList.contains("task-checkbox")) {
    const taskId = event.target.dataset.id;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.isCompleted = event.target.checked;
      saveTaskList(tasks);
      renderTaskList(tasks, listManager, filter);
    }
  }
};

export { handleTaskCheckboxChange };
