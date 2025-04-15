# 📝 ToDo List App

This is a modular ToDo application built with vanilla JavaScript.  
Inspired by Google Tasks — clean, minimal, and functional.

## 📌 Features

- Create and delete tasks  
- Click a task to select a due date: Today, Tomorrow, or a custom date  
- Selected date is shown as a label under the task  
- Tasks can be marked as completed  
- Filter tasks by: All, Active, Completed  
- Manage multiple task lists and switch between them  
- All data is stored in localStorage

## ⚙️ Tech Stack & Structure

- Vanilla JavaScript (ES6+) — classes, arrow functions, spread, destructuring, Sets/Maps  
- DOM manipulation — dynamic task rendering, event-driven updates  
- OOP architecture — clear separation with Task, TaskList, and ListManager classes  
- Modular structure — code split across /ui, /handlers, /storage, /tasks, etc.  
- Asynchronous code — ready for API integration with async/await  
- Storage — uses localStorage to persist tasks and lists

## 🚀 How to Run

1. Clone the repo:  
   `git clone https://github.com/PavloJedi/todo`  
2. Open `index.html` in your browser or run with Live Server

## 🧭 How to Use

1. Type a task and click Add Task  
2. Click on the task to open date options  
3. Choose Today, Tomorrow, or a custom date  
4. Click again on the date to change it  
5. Mark as complete, delete, or filter tasks  
6. Create new task lists and switch between them

## 🙌 Final Notes

This app was built to practice real-world JavaScript development without frameworks.  
It focuses on clean code, reusability, and modular architecture.  
You can easily extend it with animations, API sync, or backend support.

Thanks for checking it out — and happy tasking! 😊✅
