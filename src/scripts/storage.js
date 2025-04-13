function saveTaskList(taskList) {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
function loadTaskList() {
  return JSON.parse(localStorage.getItem("taskList")) || [];
}
function saveListManager(listManager) {
  localStorage.setItem("listManager", JSON.stringify(listManager));
}
function loadListManager() {
  return JSON.parse(localStorage.getItem("listManager")) || { list: [] };
}
export { saveTaskList, loadTaskList, saveListManager, loadListManager };
