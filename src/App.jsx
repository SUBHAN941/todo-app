import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Check, X, Search, Calendar, AlertCircle, Bell, Clock, Sun, Moon, Filter, Star, Archive } from "lucide-react";

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

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      try {
        const todos = JSON.parse(todoString);
        setInput(todos);
      } catch (e) {
        console.error("Error loading todos");
      }
    }

    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    const interval = setInterval(checkDueTodos, 60000);
    checkDueTodos();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification("🎉 Notifications Enabled!", {
          body: "You'll now receive beautiful reminders for your todos at the scheduled time!",
          icon: "https://cdn-icons-png.flaticon.com/512/9195/9195829.png",
          badge: "https://cdn-icons-png.flaticon.com/512/2767/2767146.png",
          vibrate: [200, 100, 200]
        });
      }
    }
  };

  const checkDueTodos = () => {
    const todoString = localStorage.getItem("todos");
    if (!todoString) return;

    const todos = JSON.parse(todoString);
    const now = new Date();
    const notifiedTodos = JSON.parse(localStorage.getItem("notifiedTodos") || "[]");

    todos.forEach((todo) => {
      if (todo.dueDateTime && !todo.isCompleted && !todo.isArchived && !notifiedTodos.includes(todo.id)) {
        const dueDate = new Date(todo.dueDateTime);
        const timeDiff = dueDate - now;
        
        if (timeDiff <= 60000 && timeDiff > -60000) {
          sendNotification(todo);
          notifiedTodos.push(todo.id);
          localStorage.setItem("notifiedTodos", JSON.stringify(notifiedTodos));
        }
      }
    });
  };

  const sendNotification = (todo) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const getPriorityEmoji = (priority) => {
        switch (priority) {
          case "high": return "🔴";
          case "medium": return "🟡";
          case "low": return "🟢";
          default: return "📌";
        }
      };

      const priorityEmoji = getPriorityEmoji(todo.priority);
      
      const notification = new Notification(`${priorityEmoji} Todo Reminder!`, {
        body: `${todo.todo}\n\n⏰ Due Now | Priority: ${todo.priority.toUpperCase()} | ${todo.category.toUpperCase()}`,
        icon: "https://cdn-icons-png.flaticon.com/512/9195/9195829.png",
        badge: "https://cdn-icons-png.flaticon.com/512/2767/2767146.png",
        tag: `todo-${todo.id}`,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        silent: false,
        data: {
          todoId: todo.id,
          priority: todo.priority
        }
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        const todoElement = document.querySelector(`[data-todo-id="${todo.id}"]`);
        if (todoElement) {
          todoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          todoElement.classList.add('pulse-animation');
          setTimeout(() => todoElement.classList.remove('pulse-animation'), 2000);
        }
      };
    }
  };

  const saveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleAdd = () => {
    if (!todo.trim()) return;

    let dueDateTime = null;
    if (dueDate && dueTime) {
      dueDateTime = new Date(`${dueDate}T${dueTime}`).toISOString();
    }

    if (editId) {
      const updatedTodos = input.map((item) =>
        item.id === editId
          ? { ...item, todo: todo.trim(), priority, dueDateTime, category }
          : item
      );
      setInput(updatedTodos);
      saveToLS(updatedTodos);
      setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        todo: todo.trim(),
        isCompleted: false,
        isArchived: false,
        isFavorite: false,
        priority,
        category,
        createdAt: new Date().toISOString(),
        dueDateTime
      };
      const newTodos = [...input, newTodo];
      setInput(newTodos);
      saveToLS(newTodos);
    }
    setTodo("");
    setPriority("medium");
    setCategory("personal");
    setDueDate("");
    setDueTime("");
  };

  const handleEdit = (id) => {
    const todoToEdit = input.find((item) => item.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.todo);
      setPriority(todoToEdit.priority);
      setCategory(todoToEdit.category || "personal");
      if (todoToEdit.dueDateTime) {
        const dueDate = new Date(todoToEdit.dueDateTime);
        setDueDate(dueDate.toISOString().split('T')[0]);
        setDueTime(dueDate.toTimeString().slice(0, 5));
      }
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const newTodos = input.filter((item) => item.id !== id);
    setInput(newTodos);
    saveToLS(newTodos);
    
    const notifiedTodos = JSON.parse(localStorage.getItem("notifiedTodos") || "[]");
    const updatedNotified = notifiedTodos.filter(notifiedId => notifiedId !== id);
    localStorage.setItem("notifiedTodos", JSON.stringify(updatedNotified));
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = input.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setInput(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleToggleFavorite = (id) => {
    const updatedTodos = input.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setInput(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleArchive = (id) => {
    const updatedTodos = input.map((item) =>
      item.id === id ? { ...item, isArchived: !item.isArchived } : item
    );
    setInput(updatedTodos);
    saveToLS(updatedTodos);
  };

  const cancelEdit = () => {
    setEditId(null);
    setTodo("");
    setPriority("medium");
    setCategory("personal");
    setDueDate("");
    setDueTime("");
  };

  const filteredTodos = input
    .filter((item) => {
      if (showArchived) return item.isArchived;
      if (item.isArchived) return false;
      if (filter === "active") return !item.isCompleted;
      if (filter === "completed") return item.isCompleted;
      if (filter === "favorite") return item.isFavorite;
      return true;
    })
    .filter((item) =>
      item.todo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort: favorites first, then by priority, then by due date
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      if (a.dueDateTime && !b.dueDateTime) return -1;
      if (!a.dueDateTime && b.dueDateTime) return 1;
      if (a.dueDateTime && b.dueDateTime) {
        return new Date(a.dueDateTime) - new Date(b.dueDateTime);
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    total: input.filter(t => !t.isArchived).length,
    completed: input.filter((t) => t.isCompleted && !t.isArchived).length,
    active: input.filter((t) => !t.isCompleted && !t.isArchived).length,
    archived: input.filter(t => t.isArchived).length,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme === "dark" ? "bg-red-500" : "bg-red-400";
      case "medium":
        return theme === "dark" ? "bg-yellow-500" : "bg-yellow-400";
      case "low":
        return theme === "dark" ? "bg-green-500" : "bg-green-400";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (cat) => {
    const colors = {
      personal: theme === "dark" ? "bg-blue-500" : "bg-blue-400",
      work: theme === "dark" ? "bg-purple-500" : "bg-purple-400",
      shopping: theme === "dark" ? "bg-pink-500" : "bg-pink-400",
      health: theme === "dark" ? "bg-green-500" : "bg-green-400",
    };
    return colors[cat] || "bg-gray-500";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0) return "Overdue";
    if (diffMins < 60) return `${diffMins}m left`;
    if (diffHours < 24) return `${diffHours}h left`;
    if (diffDays < 7) return `${diffDays}d left`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDueOrOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (date - now) / 3600000;
    return diffHours <= 24;
  };

  // Theme styles
  const isDark = theme === "dark";
  const bgGradient = isDark 
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const inputBg = isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800";
  const hoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className={`min-h-screen ${bgGradient} py-8 px-4 transition-colors duration-300`}>
      <style>{`
        @keyframes pulse-animation {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
        }
        .pulse-animation {
          animation: pulse-animation 0.5s ease-in-out 4;
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`absolute right-0 top-0 p-3 rounded-xl ${cardBg} ${textPrimary} shadow-lg ${hoverBg} transition-all`}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <h1 className={`text-5xl font-bold ${textPrimary} mb-2 drop-shadow-lg`}>
            ✨ Todo Master
          </h1>
          <p className={`${textSecondary} text-lg`}>
            Organize your tasks with style
          </p>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== "granted" && (
          <div className={`${isDark ? "bg-yellow-600" : "bg-yellow-400"} text-yellow-900 p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg`}>
            <div className="flex items-center gap-3">
              <Bell size={24} />
              <div>
                <p className="font-semibold">Enable Notifications</p>
                <p className="text-sm">Get reminders for your scheduled todos</p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-yellow-900 text-yellow-100 px-4 py-2 rounded-lg hover:bg-yellow-800 transition-all"
            >
              Enable
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className={`${cardBg} rounded-3xl shadow-2xl overflow-hidden`}>
          {/* Stats Bar */}
          <div className={`${isDark ? "bg-gradient-to-r from-indigo-700 to-purple-700" : "bg-gradient-to-r from-indigo-500 to-purple-500"} text-white p-6`}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-90">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.active}</div>
                <div className="text-sm opacity-90">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.completed}</div>
                <div className="text-sm opacity-90">Done</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.archived}</div>
                <div className="text-sm opacity-90">Archived</div>
              </div>
            </div>
            {stats.total > 0 && (
              <div className="mt-4">
                <div className="bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.completed / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Add Todo Section */}
          <div className={`p-6 border-b ${borderColor}`}>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>
              {editId ? "✏️ Edit Todo" : "➕ Add New Todo"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-3 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none text-lg transition-all`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`px-4 py-2 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none`}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High Priority</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-4 py-2 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none`}
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">🏥 Health</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`px-4 py-2 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none`}
                  min={new Date().toISOString().split('T')[0]}
                />

                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className={`px-4 py-2 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!todo.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {editId ? "💾 Update Todo" : "➕ Add Todo"}
                </button>

                {editId && (
                  <button
                    onClick={cancelEdit}
                    className={`px-4 py-3 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-xl ${hoverBg} transition-all`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {dueDate && dueTime && (
                <div className={`flex items-center gap-2 text-sm ${textSecondary} ${isDark ? "bg-blue-900" : "bg-blue-50"} px-4 py-2 rounded-lg`}>
                  <Bell size={16} />
                  <span>Reminder set for {new Date(`${dueDate}T${dueTime}`).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Filter and Search */}
          <div className={`p-6 border-b ${borderColor} ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary}`}
                  size={20}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search todos..."
                  className={`w-full pl-10 pr-4 py-2 border-2 ${inputBg} rounded-xl focus:border-indigo-500 focus:outline-none`}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {["all", "active", "completed", "favorite"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === f
                        ? "bg-indigo-600 text-white"
                        : `${isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-600"} ${hoverBg}`
                    }`}
                  >
                    {f === "favorite" && "⭐ "}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    showArchived
                      ? "bg-orange-600 text-white"
                      : `${isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-600"} ${hoverBg}`
                  }`}
                >
                  <Archive size={16} className="inline mr-1" />
                  {showArchived ? "Hide" : "Show"} Archived
                </button>
              </div>
            </div>
          </div>

          {/* Todos List */}
          <div className="p-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className={`mx-auto ${textSecondary} mb-4`} size={48} />
                <p className={`${textSecondary} text-lg`}>
                  {searchTerm
                    ? "No todos found"
                    : showArchived
                    ? "No archived todos"
                    : input.length === 0
                    ? "No todos yet. Add one to get started!"
                    : "No todos in this category"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((item) => (
                  <div
                    key={item.id}
                    data-todo-id={item.id}
                    className={`group ${
                      isDark 
                        ? item.isCompleted
                          ? "bg-gradient-to-r from-gray-700 to-gray-600"
                          : isDueOrOverdue(item.dueDateTime)
                          ? "bg-gradient-to-r from-red-900 to-orange-900 border-red-700"
                          : "bg-gradient-to-r from-gray-800 to-gray-700"
                        : item.isCompleted
                        ? "bg-gradient-to-r from-gray-50 to-gray-100"
                        : isDueOrOverdue(item.dueDateTime)
                        ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-300"
                        : "bg-gradient-to-r from-white to-gray-50"
                    } border-2 ${borderColor} rounded-2xl p-4 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.isCompleted
                            ? "bg-green-500 border-green-500"
                            : `${isDark ? "border-gray-500 hover:border-indigo-400" : "border-gray-300 hover:border-indigo-500"}`
                        }`}
                      >
                        {item.isCompleted && <Check size={16} className="text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(
                              item.priority
                            )}`}
                          />
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${getCategoryColor(item.category)} text-white`}
                          >
                            {item.category}
                          </span>
                          {item.isFavorite && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                          <p
                            className={`text-lg ${
                              item.isCompleted
                                ? `line-through ${isDark ? "text-gray-400" : "text-gray-400"}`
                                : textPrimary
                            }`}
                          >
                            {item.todo}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${textSecondary} flex-wrap`}>
                          <Calendar size={12} />
                          <span>{formatDate(item.createdAt)}</span>
                          <span className="text-gray-300">•</span>
                          <span className="capitalize">{item.priority}</span>
                          {item.dueDateTime && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className={`flex items-center gap-1 ${
                                isDueOrOverdue(item.dueDateTime) && !item.isCompleted
                                  ? "text-red-600 font-semibold"
                                  : "text-blue-600"
                              }`}>
                                <Clock size={12} />
                                <span>{formatDueDate(item.dueDateTime)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleFavorite(item.id)}
                          className={`p-2 ${item.isFavorite ? "text-yellow-500" : `${textSecondary}`} ${isDark ? "hover:bg-gray-700" : "hover:bg-blue-50"} rounded-lg transition-all`}
                        >
                          <Star size={18} className={item.isFavorite ? "fill-yellow-500" : ""} />
                        </button>
                        <button
                          onClick={() => handleEdit(item.id)}
                          className={`p-2 text-blue-600 ${isDark ? "hover:bg-gray-700" : "hover:bg-blue-50"} rounded-lg transition-all`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleArchive(item.id)}
                          className={`p-2 text-orange-600 ${isDark ? "hover:bg-gray-700" : "hover:bg-orange-50"} rounded-lg transition-all`}
                        >
                          <Archive size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`p-2 text-red-600 ${isDark ? "hover:bg-gray-700" : "hover:bg-red-50"} rounded-lg transition-all`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-6 ${textSecondary} text-sm`}>
          Made with ❤️ • Keep crushing your goals!
        </div>
      </div>
    </div>
  );
};

export default App;