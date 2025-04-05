async function getTodos() {
  try {
    const response = await fetch("https://dummyjson.com/todos");
    const data = await response.json();
    return data.todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

async function addTodo(todo) {
  try {
    const response = await fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

async function updateTodo(id, updatedTodo) {
  try {
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

export { getTodos, addTodo, deleteTodo, updateTodo };
