import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://127.0.0.1:8000";

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          priority,
          completed: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Add task failed: ${res.status}`);
      }

      setTitle("");
      setPriority("medium");
      setPlan([]);
      await fetchTasks();
    } catch (error) {
      console.error("Add task error:", error);
      alert("Failed to add task.");
    }
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      setPlan([]);

      const res = await fetch(`${API_BASE}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Generate plan failed: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.plan)) {
        setPlan(data.plan);
      } else {
        alert(data.message || "Could not generate plan.");
      }
    } catch (error) {
      console.error("Generate plan error:", error);
      alert("Something went wrong while generating the plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="page-shell">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="bg-orb orb-4"></div>

      <main className="app-container">
        <header className="hero">
          <div className="logo-wrap">
            <div className="logo-bot">🤖</div>
            <div>
              <h1>LifeOS</h1>
              <p>Personal AI Automation Agent</p>
            </div>
          </div>
        </header>

        <section className="glass-card main-card">
          <h2 className="section-title">Add Task</h2>

          <div className="task-form">
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button className="gradient-btn add-btn" onClick={addTask}>
              Add Task <span className="plus">＋</span>
            </button>
          </div>
        </section>

        <section className="glass-card main-card">
          <h2 className="section-title">Your Tasks</h2>

          {tasks.length === 0 ? (
            <div className="empty-box">
              <p>No tasks yet. Add your first task.</p>
            </div>
          ) : (
            <div className="task-stack">
              {tasks.map((task, index) => (
                <div key={index} className="task-card">
                  <div className="task-top-row">
                    <div className="task-name">{task.title}</div>

                    <span className={`priority-pill ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="task-bottom-row">
                    <div className="action-pill">
                      <span>✓</span>
                      <span>✕</span>
                      <span>🗑</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card main-card">
          <h2 className="section-title">Smart Daily Plan</h2>

          <button
            className="gradient-btn plan-btn"
            onClick={generatePlan}
            disabled={loading}
          >
            <span className="bolt">⚡</span>
            {loading ? "Generating..." : "Generate Plan"}
          </button>

          {plan.length > 0 ? (
            <div className="plan-board">
              {plan.map((item, index) => (
                <div key={index} className="plan-item">
                  <span className="plan-index">{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box plan-empty">
              <p>Your generated smart daily plan will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;