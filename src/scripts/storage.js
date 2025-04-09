function saveTaskList(taskList) {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function loadTaskList() {
  return JSON.parse(localStorage.getItem("taskList")) || [];
}

export { saveTaskList, loadTaskList };
