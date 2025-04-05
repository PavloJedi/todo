function saveTaskList(taskList) {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
function loadTaskList() {
  const taskList = localStorage.getItem("taskList");
  return taskList ? JSON.parse(taskList) : [];
}
function clearTaskList() {
  localStorage.removeItem("taskList");
}

export { saveTaskList, loadTaskList, clearTaskList }; 
