import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Todo.css";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const apiUrl = "https://todo-backend-o3uv.onrender.com";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res))
      .catch(() =>
        toast.error("Failed to fetch todos", { position: "top-right" })
      );
  };

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description, _id: Date.now() }]);
            toast.success("Item added successfully", { position: "top-right" });
            setTitle("");
            setDescription("");
          } else {
            toast.error("Unable to create Todo item", { position: "top-right" });
          }
        })
        .catch(() =>
          toast.error("Unable to create Todo item", { position: "top-right" })
        );
    } else {
      toast.warning("Title and Description cannot be empty", {
        position: "top-right",
      });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: edittitle, description: editdescription }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) =>
              item._id === editId
                ? { ...item, title: edittitle, description: editdescription }
                : item
            );
            setTodos(updatedTodos);
            toast.info("Item updated successfully", { position: "top-right" });
            setEditId(-1);
          } else {
            toast.error("Unable to update Todo item", { position: "top-right" });
          }
        })
        .catch(() =>
          toast.error("Unable to update Todo item", { position: "top-right" })
        );
    } else {
      toast.warning("Fields cannot be empty", { position: "top-right" });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then(() => {
          setTodos(todos.filter((item) => item._id !== id));
          toast.success("Deleted successfully", { position: "top-right" });
        })
        .catch(() => toast.error("Unable to delete", { position: "top-right" }));
    }
  };

  return (
    <div className="container">
      <h1 className="title">Todo App</h1>
      <div className="todo-form">
        <input
          className="input-field"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="primary-btn" onClick={handleSubmit}>
          Add Task
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((item) => (
          <li key={item._id} className="todo-item">
            {editId === item._id ? (
              <>
                <input
                  className="input-field"
                  value={edittitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="input-field"
                  value={editdescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button
                  className="update-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate();
                  }}
                >
                  Update
                </button>
                <button
                  className="cancel-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditId(-1);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="todo-text">{item.title}</span>
                <span className="todo-text">{item.description}</span>
                <div className="btn-group">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
}
