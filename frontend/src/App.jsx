import { useEffect, useMemo, useState } from "react";
import "./App.css";


function App() {
  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://lifeos-demo.onrender.com";


  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);


  const [emailText, setEmailText] = useState(
    "Write a follow-up email to the client."
  );
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [selectedReply, setSelectedReply] = useState(
    "Busy right now. Can I call you later?"
  );
  const [mapQuery, setMapQuery] = useState("");
  const [mapResult, setMapResult] = useState("Search nearby places...");
  const [voiceText, setVoiceText] = useState("How can I assist you?");
  const [activeMenu, setActiveMenu] = useState("Dashboard");


  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);


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
    setAdding(true);

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

    const data = await res.json();

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Failed to add task");
    }

    setTitle("");
    setPriority("medium");
    await fetchTasks();
  } catch (error) {
    console.error("Add task error:", error);
    alert(error.message || "Failed to add task.");
  } finally {
    setAdding(false);
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


      const data = await res.json();


      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "Could not generate plan.");
      }


      setPlan(data.plan || []);
      setActiveMenu("Daily Plan");
    } catch (error) {
      console.error("Generate plan error:", error);
      alert(error.message || "Something went wrong while generating the plan.");
    } finally {
      setLoading(false);
    }
  };


  const createEmail = () => {
  const text = `Subject: Follow-up

Hi,

I hope you're doing well.

Just following up on recent tasks. Please let me know your thoughts.

Best,
Bappy`;

  setEmailText("");

  let i = 0;
  const interval = setInterval(() => {
    setEmailText((prev) => prev + text[i]);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 10);
};


  const manageReplies = () => {
    const options = [
      "Busy right now. Can I call you later?",
      "On a call. Back to you soon.",
      "Currently working on priority tasks. I’ll reply shortly.",
    ];


    const next =
      options[(options.indexOf(selectedReply) + 1) % options.length] ||
      options[0];
    setSelectedReply(next);
  };


  const searchPlace = () => {
  setMapResult("🔍 Searching...");

  setTimeout(() => {
    setMapResult("Nearest pharmacy • 3 min away");
  }, 1000);
};


  const runVoiceAssistant = () => {
    const responses = [
      "Your top priority today is to finish the most important task first.",
      "You have pending work. Open the daily plan for the next steps.",
      "I can help you organize your tasks, email drafts, and nearby places.",
    ];
    const random = responses[Math.floor(Math.random() * responses.length)];
    setVoiceText(random);
  };


  useEffect(() => {
    fetchTasks();
  }, []);


  const menuItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Daily Plan", icon: "🗓️" },
    { label: "Tasks", icon: "✅" },
    { label: "Map & Nearby", icon: "📍" },
  ];


  return (
    <div className="lifeos-shell">
      <div className="bg-blur bg-blur-1"></div>
      <div className="bg-blur bg-blur-2"></div>
      <div className="bg-blur bg-blur-3"></div>


      <aside className="sidebar glass">
        <div className="brand">
          <div className="brand-icon">🤖</div>
          <div className="brand-text">
            <h2>LifeOS</h2>
            <p>AI life dashboard</p>
          </div>
        </div>


        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                activeMenu === item.label ? "nav-item-active" : ""
              }`}
              onClick={() => setActiveMenu(item.label)}
            >
              <span className="nav-emoji">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>


        <div className="profile-card glass-inner">
          <div className="avatar">B</div>
          <div>
            <h4>Bappy</h4>
            <p>99+ Notifications</p>
          </div>
        </div>
      </aside>


      <main className="main-panel">
        <header className="topbar">
          <h1>
            {greeting}, Bappy <span className="wave">👋🏻</span>
          </h1>
        </header>


        <section className="dashboard-grid">
          <div className="panel panel-tasks glass">
            <div className="panel-head">
              <h3>Your Tasks</h3>
              <div className="mini-actions">
                <span>✦</span>
                <span>🖊️</span>
              </div>
            </div>


            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-soft">
                  ✨ No tasks yet. Start your productive day.
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div className="task-row glass-inner" key={index}>
                    <div className="task-left">
                      <span className="check-badge">☑</span>
                      <span className="task-name">{task.title}</span>
                    </div>


                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>


            <div className="add-task-box">
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
              <button
              className="action-btn gradient-btn"
               onClick={addTask}
              disabled={adding}
              >
             {adding ? "Adding..." : "+ Add Task"}
             </button>
            </div>
          </div>


          <div className="panel panel-email glass">
            <div className="panel-head">
              <h3>AI-Generated Email</h3>
            </div>


            <div className="email-hero glass-inner">
              <div className="email-icon">📩</div>
              <div>
                <p className="muted">
                  Instantly create a professional follow-up email.
                </p>
              </div>
            </div>


            <textarea
              className="email-preview"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />


            <div className="service-row">
              <span>✈️</span>
              <span>✉️</span>
              <span>🐦</span>
              <span>💗</span>
              <span>⋯</span>
            </div>


            <button className="action-btn soft-btn" onClick={createEmail}>
              Generate Email
            </button>
          </div>


          <div className="panel panel-reply glass">
            <div className="panel-head">
              <h3>Smart Auto-Reply</h3>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoReplyEnabled}
                  onChange={() => setAutoReplyEnabled((prev) => !prev)}
                />
                <span className="slider"></span>
              </label>
            </div>


            <div className="reply-bot glass-inner">
              <div className="bot-face">🤖</div>
              <p>{selectedReply}</p>
            </div>


            <div className="reply-list glass-inner">
              <div>☑ Busy right now. Can I call you later?</div>
              <div>☑ On a call. Back to you soon.</div>
            </div>


            <button className="action-btn soft-btn" onClick={manageReplies}>
              Manage Replies
            </button>
          </div>


          <div className="panel panel-plan glass">
            <div className="panel-head">
              <h3>Daily Priority Planner</h3>
            </div>


            <p className="muted">
              Generate a smart daily to-do list based on your current tasks.
            </p>


            <div className="plan-list-board glass-inner">
              {plan.length > 0 ? (
                plan.map((item, index) => (
                  <div className="plan-row" key={index}>
                    <span className="sparkle">✦</span>
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="plan-row">
                    <span className="sparkle">✦</span>
                    <span>Review project proposal</span>
                  </div>
                  <div className="plan-row">
                    <span className="sparkle">✦</span>
                    <span>Attend team meeting</span>
                  </div>
                  <div className="plan-row">
                    <span className="sparkle">✦</span>
                    <span>Follow up with client</span>
                  </div>
                </>
              )}
            </div>


            <button
              className="action-btn gradient-btn"
              onClick={generatePlan}
              disabled={loading}
            >
              ⚡ {loading ? "Generating..." : "Generate Plan"}
            </button>
          </div>


          <div className="panel panel-services glass">
            <div className="panel-head">
              <h3>Connected Services</h3>
            </div>


            <p className="muted">Manage all your apps and smart modules.</p>


            <div className="service-row large">
              <span>✈️</span>
              <span>✉️</span>
              <span>🐦</span>
              <span>💗</span>
              <span>⋯</span>
            </div>


            <div className="coming-soon glass-inner">AI integrations ready for expansion</div>
          </div>


          <div className="panel panel-map glass">
            <div className="panel-head">
              <h3>AI Map & Discovery</h3>
            </div>


            <div className="map-search">
              <input
                type="text"
                placeholder="Search places..."
                value={mapQuery}
                onChange={(e) => setMapQuery(e.target.value)}
              />
              <button className="mini-search-btn" onClick={searchPlace}>
                🔎
              </button>
            </div>


            <div className="map-box glass-inner">
              <div className="map-pins">
                <span className="pin pink">📍</span>
                <span className="pin blue">📍</span>
                <span className="pin red">📍</span>
              </div>


              <div className="map-badge">7 min</div>
              <div className="map-result">{mapResult}</div>
            </div>
          </div>


          <div className="panel panel-voice glass">
            <div className="voice-visual">
              <div className="voice-core">🎙️</div>
            </div>


            <h3>How can I assist you?</h3>


            <div className="voice-suggestions">
              <div>✦ What's my schedule today?</div>
              <div>✦ Find a nearby pharmacy...</div>
            </div>


            <div className="voice-response glass-inner">{voiceText}</div>


            <button className="action-btn soft-btn" onClick={runVoiceAssistant}>
              Ask LifeOS
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}


export default App;