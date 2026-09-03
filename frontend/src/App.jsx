import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    priority: "Medium",
  });

  // GET tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error getting tasks:", error);
    }
  };

  // Runs when page first loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Update form values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add task
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.title ||
    !formData.description ||
    !formData.category ||
    !formData.dueDate
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    if (editingId) {
      // UPDATE existing task
      await axios.put(
        `http://localhost:5000/api/tasks/${editingId}`,
        formData
      );

      setEditingId(null);
    } else {
      // CREATE new task
      await axios.post(
        "http://localhost:5000/api/tasks",
        formData
      );
    }

    setFormData({
      title: "",
      description: "",
      category: "",
      dueDate: "",
      priority: "Medium",
    });

    fetchTasks();
  } catch (error) {
    console.error("Error saving task:", error);
  }
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const handleComplete = async (task) => {
  try {
    await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      {
        ...task,
        status: "Completed",
      }
    );

    fetchTasks();
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const handleEdit = (task) => {
  setEditingId(task._id);

  setFormData({
    title: task.title,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate.split("T")[0],
    priority: task.priority,
  });
};

  return (
    <div className="container">

      <h1>Student Task Manager</h1>

      <h2>Add Task</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Academic">Academic</option>
          <option value="Exam">Exam</option>
          <option value="Assignment">Assignment</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <button type="submit">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task._id}>

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Category:</strong> {task.category}
            </p>

            <p>
              <strong>Priority:</strong> {task.priority}
            </p>

            <p>
              <strong>Status:</strong> {task.status}
            </p>

            <button onClick={() => handleDelete(task._id)}>
              Delete
            </button>

            {task.status !== "Completed" && (
            <button onClick={() => handleComplete(task)}>
              Mark Completed
            </button>
            )}
            <button onClick={() => handleEdit(task)}>
              Edit
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default App;