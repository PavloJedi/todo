import { saveListManager } from "./storage.js";
import { renderTaskList } from "./taskRenderer.js";

const renderListPopup = (listManager, taskList) => {
  const popupList = document.querySelector("#taskListPopup .popup__list");
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
      document.getElementById("taskListPopup").style.display = "none";
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

  const createButton = document.querySelector(
    "#taskListPopup .popup__create-btn"
  );
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
            document.getElementById("taskListPopup").style.display = "none";
          }
          document.getElementById("taskListPopup").removeChild(input);
          createButton.style.display = "block";
        }
      });
      document.getElementById("taskListPopup").appendChild(input);
      input.focus();
    });
  }
};

const updateActiveListButton = (listName) => {
  document.querySelector(".todo__filter-btn--active").textContent = listName;
};

export { renderListPopup, updateActiveListButton };
