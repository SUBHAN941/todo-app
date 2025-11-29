import React, { useState, useEffect } from "react";
import {
  Trash2, Edit2, Check, X, Search, Calendar, AlertCircle, Bell, Clock,
  Star, Archive, User, Camera, Settings, Sun, Moon
} from "lucide-react";

const App = () => {
  const [todo, setTodo] = useState("");
  const [input, setInput] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [category, setCategory] = useState("personal");
  const [showArchived, setShowArchived] = useState(false);

  // Profile States
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem("userAvatar") || "");
  const [userBio, setUserBio] = useState(() => localStorage.getItem("userBio") || "Just a productive human");
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("userName", userName); }, [userName]);
  useEffect(() => { localStorage.setItem("userAvatar", userAvatar); }, [userAvatar]);
  useEffect(() => { localStorage.setItem("userBio", userBio); }, [userBio]);
  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) setInput(JSON.parse(todoString));
    if ("Notification" in window) setNotificationPermission(Notification.permission);

    const interval = setInterval(checkDueTodos, 60000);
    checkDueTodos();
    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification("Notifications On!", {
          body: "You’ll get reminders for your todos!",
          icon: "https://cdn-icons-png.flaticon.com/512/9195/9195829.png"
        });
      }
    }
  };

  const checkDueTodos = () => {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    const now = new Date();
    const notified = JSON.parse(localStorage.getItem("notifiedTodos") || "[]");

    todos.forEach(todo => {
      if (todo.dueDateTime && !todo.isCompleted && !todo.isArchived && !notified.includes(todo.id)) {
        const due = new Date(todo.dueDateTime);
        if (Math.abs(due - now) <= 60000) {
          new Notification("Todo Due!", { body: todo.todo, tag: todo.id });
          notified.push(todo.id);
          localStorage.setItem("notifiedTodos", JSON.stringify(notified));
        }
      }
    });
  };

  const saveToLS = (todos) => localStorage.setItem("todos", JSON.stringify(todos));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUserAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!todo.trim()) return;
    const dueDateTime = dueDate && dueTime ? new Date(`${dueDate}T${dueTime}`).toISOString() : null;

    if (editId) {
      const updated = input.map(t => t.id === editId ? { ...t, todo: todo.trim(), priority, category, dueDateTime } : t);
      setInput(updated); saveToLS(updated); setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(), todo: todo.trim(), isCompleted: false, isArchived: false,
        isFavorite: false, priority, category, createdAt: new Date().toISOString(), dueDateTime
      };
      const updated = [...input, newTodo];
      setInput(updated); saveToLS(updated);
    }
    setTodo(""); setPriority("medium"); setCategory("personal"); setDueDate(""); setDueTime("");
  };

  const handleEdit = (id) => {
    const t = input.find(i => i.id === id);
    if (t) {
      setTodo(t.todo); setPriority(t.priority); setCategory(t.category || "personal");
      if (t.dueDateTime) {
        const d = new Date(t.dueDateTime);
        setDueDate(d.toISOString().split('T')[0]);
        setDueTime(d.toTimeString().slice(0, 5));
      }
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    setInput(input.filter(t => t.id !== id));
    saveToLS(input.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id) => {
    const updated = input.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setInput(updated); saveToLS(updated);
  };

  const handleToggleFavorite = (id) => {
    const updated = input.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
    setInput(updated); saveToLS(updated);
  };

  const handleArchive = (id) => {
    const updated = input.map(t => t.id === id ? { ...t, isArchived: !t.isArchived } : t);
    setInput(updated); saveToLS(updated);
  };

  const filteredTodos = input
    .filter(t => showArchived ? t.isArchived : !t.isArchived)
    .filter(t => filter === "all" || (filter === "active" && !t.isCompleted) || (filter === "completed" && t.isCompleted) || (filter === "favorite" && t.isFavorite))
    .filter(t => t.todo.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      const p = { high: 3, medium: 2, low: 1 };
      if (p[a.priority] !== p[b.priority]) return p[b.priority] - p[a.priority];
      if (a.dueDateTime && b.dueDateTime) return new Date(a.dueDateTime) - new Date(b.dueDateTime);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    total: input.filter(t => !t.isArchived).length,
    active: input.filter(t => !t.isCompleted && !t.isArchived).length,
    completed: input.filter(t => t.isCompleted && !t.isArchived).length,
    archived: input.filter(t => t.isArchived).length,
  };

  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50";
  const cardBg = isDark ? "bg-gray-800/90" : "bg-white/90";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const inputBg = isDark ? "bg-gray-700/70 border-gray-600" : "bg-white/70 border-gray-300";

  return (
    <div className={`min-h-screen ${bgGradient} py-8 px-4 transition-all duration-500`}>
      <style>{`
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        .pulse { animation: pulse 0.6s ease-in-out 4; }
        .glass { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative mb-8 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className={`text-5xl font-bold ${textPrimary} mb-2`}>Todo Master</h1>
            {userName ? (
              <div>
                <p className="text-2xl font-semibold text-indigo-400">{userName}</p>
                <p className={`${textSecondary} text-sm italic mt-1 max-w-md mx-auto`}>{userBio}</p>
              </div>
            ) : (
              <p className={`${textSecondary} text-lg`}>Organize your life beautifully</p>
            )}
          </div>

          {/* Settings Button (Right Side) */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-4 rounded-2xl ${cardBg} backdrop-blur-lg shadow-xl border ${borderColor} hover:scale-110 transition-all`}
          >
            <Settings size={28} className={textPrimary} />
          </button>
        </div>

        {/* Notification Banner */}
        {notificationPermission !== "granted" && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-700 p-4 rounded-2xl mb-6 flex items-center justify-between backdrop-blur">
            <div className="flex items-center gap-3">
              <Bell size={24} />
              <div>
                <p className="font-bold">Enable Notifications</p>
                <p className="text-sm">Never miss a deadline again!</p>
              </div>
            </div>
            <button onClick={requestNotificationPermission} className="bg-yellow-600 text-white px-5 py-2 rounded-xl hover:bg-yellow-700">
              Enable
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className={`${cardBg} backdrop-blur-xl rounded-3xl shadow-2xl border ${borderColor} overflow-hidden`}>
          {/* Stats */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              {["total", "active", "completed", "archived"].map((key) => (
                <div key={key}>
                  <div className="text-3xl font-bold">{stats[key]}</div>
                  <div className="text-sm capitalize opacity-90">{key === "total" ? "All" : key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Todo */}
          <div className={`p-6 border-b ${borderColor}`}>
            <input
              type="text" value={todo} onChange={e => setTodo(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleAdd()}
              placeholder="What's on your mind today?"
              className={`w-full px-5 py-4 text-lg rounded-2xl border-2 ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none transition-all`}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <select value={priority} onChange={e => setPriority(e.target.value)} className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
              </select>
              <select value={category} onChange={e => setCategory(e.target.value)} className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
              </select>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`} />
              <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`} />
            </div>
            <button onClick={handleAdd} disabled={!todo.trim()} className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50">
              {editId ? "Update Todo" : "Add Todo"}
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 flex gap-3 flex-wrap">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className={`flex-1 px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`} />
            {["all", "active", "completed", "favorite"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 rounded-xl font-medium ${filter === f ? "bg-indigo-600 text-white" : `${cardBg} ${textPrimary}`}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button onClick={() => setShowArchived(!showArchived)} className={`px-5 py-3 rounded-xl ${showArchived ? "bg-orange-600 text-white" : `${cardBg} ${textPrimary}`}`}>
              <Archive size={18} className="inline mr-1" /> {showArchived ? "Hide" : "Show"} Archived
            </button>
          </div>

          {/* Todo List */}
          <div className="p-6 space-y-4">
            {filteredTodos.length === 0 ? (
              <p className={`text-center ${textSecondary} text-xl py-12`}>Nothing here yet. Time to add some magic!</p>
            ) : (
              filteredTodos.map(item => (
                <div key={item.id} data-todo-id={item.id} className={`p-5 rounded-2xl border ${borderColor} ${cardBg} backdrop-blur hover:shadow-xl transition-all group`}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggleComplete(item.id)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${item.isCompleted ? "bg-green-500 border-green-500" : "border-gray-400"}`}>
                      {item.isCompleted && <Check size={18} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-lg ${item.isCompleted ? "line-through opacity-60" : textPrimary}`}>{item.todo}</p>
                      <div className={`text-sm ${textSecondary} flex gap-3 mt-1`}>
                        <span>{item.priority}</span>
                        <span>{item.category}</span>
                        {item.dueDateTime && <span>Due {new Date(item.dueDateTime).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleToggleFavorite(item.id)}><Star size={20} className={item.isFavorite ? "fill-yellow-500 text-yellow-500" : textSecondary} /></button>
                      <button onClick={() => handleEdit(item.id)}><Edit2 size={20} className="text-blue-500" /></button>
                      <button onClick={() => handleArchive(item.id)}><Archive size={20} className="text-orange-500" /></button>
                      <button onClick={() => handleDelete(item.id)}><Trash2 size={20} className="text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <p className={`text-center mt-8 ${textSecondary}`}>Made with love • Keep shining, {userName || "friend"}!</p>
      </div>

      {/* SETTINGS MODAL - GLASSMORPHISM + BLUR */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>

          {/* Modal */}
          <div className={`${cardBg} glass border ${borderColor} rounded-3xl shadow-2xl p-8 max-w-md w-full relative`}>
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20">
              <X size={24} />
            </button>

            <h2 className={`text-3xl font-bold ${textPrimary} text-center mb-8`}>Profile & Settings</h2>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <label htmlFor="avatar" className="cursor-pointer relative group">
                {userAvatar ? (
                  <img src={userAvatar} alt="You" className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-500/50" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white">
                    {tempName[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={36} className="text-white" />
                </div>
              </label>
              <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            {/* Name */}
            <input
              type="text" value={tempName} onChange={e => setTempName(e.target.value)}
              placeholder="Your Name" className={`w-full text-center text-2xl font-bold px-6 py-4 rounded-2xl border ${inputBg} ${textPrimary} mb-4`}
            />

            {/* Bio */}
            <textarea
              value={tempBio} onChange={e => setTempBio(e.target.value)}
              placeholder="Write something about yourself..."
              rows={3}
              className={`w-full px-5 py-4 rounded-2xl border ${inputBg} ${textPrimary} resize-none mb-6`}
            />

            {/* Theme */}
            <div className="flex items-center justify-between mb-8">
              <span className={`text-lg ${textPrimary}`}>Theme</span>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium flex items-center gap-3"
              >
                {isDark ? <Moon size={22} /> : <Sun size={22} />}
                {isDark ? "Dark Mode" : "Light Mode"}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-4 rounded-2xl border border-gray-400 font-medium">
                Cancel
              </button>
              <button
                onClick={() => {
                  setUserName(tempName.trim() || "User");
                  setUserBio(tempBio.trim() || "Just a productive human");
                  setShowSettings(false);
                }}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:scale-105 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;