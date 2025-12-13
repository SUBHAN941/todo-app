import React, { useState, useEffect, useRef } from "react";
import {
  Trash2, Edit2, Check, X, Search, Calendar, AlertCircle, Bell, Clock,
  Star, Archive, User, Camera, Settings, Sun, Moon, Plus, Filter, Download,
  Upload, BarChart3, Target, Tag, List, Grid, Clock3, Timer, Play, Pause,
  CheckCircle2, TrendingUp, FolderOpen, Copy, Share2, MessageSquare, Paperclip,
  MoreVertical, ChevronDown, ChevronRight, Hash, Award, Zap, Activity, Layout,
  GitBranch, RefreshCw, LogOut, LogIn, UserPlus, Eye, EyeOff, Lock, Mail,
  Save, FileText, PieChart, CalendarDays, Repeat, LinkIcon, Flag, Layers,
  Pin, PinOff, Maximize2, Minimize2, Move, Volume2, VolumeX, BellRing
} from "lucide-react";

const App = () => {
  // ==================== AUTH STATES ====================
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [currentUser, setCurrentUser] = useState(() => 
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ==================== TODO STATES ====================
  const [todo, setTodo] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [input, setInput] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [category, setCategory] = useState("personal");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedProject, setSelectedProject] = useState("inbox");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState("daily");
  const [estimatedTime, setEstimatedTime] = useState("");

  // ==================== WIDGET STATES ====================
  const [showWidget, setShowWidget] = useState(() => 
    JSON.parse(localStorage.getItem("showWidget") || "false")
  );
  const [pinnedTodos, setPinnedTodos] = useState(() => 
    JSON.parse(localStorage.getItem("pinnedTodos") || "[]")
  );
  const [widgetPosition, setWidgetPosition] = useState(() => 
    JSON.parse(localStorage.getItem("widgetPosition") || '{"x": 20, "y": 20}')
  );
  const [widgetSize, setWidgetSize] = useState(() => 
    localStorage.getItem("widgetSize") || "medium"
  );
  const [widgetOpacity, setWidgetOpacity] = useState(() => 
    parseFloat(localStorage.getItem("widgetOpacity") || "0.95")
  );
  const [widgetCollapsed, setWidgetCollapsed] = useState(false);
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  // ==================== NOTIFICATION STATES ====================
  const [notificationSettings, setNotificationSettings] = useState(() => 
    JSON.parse(localStorage.getItem("notificationSettings") || JSON.stringify({
      enabled: false,
      sound: true,
      reminderBefore: 15, // minutes
      dailyDigest: true,
      digestTime: "09:00",
      overdueReminders: true,
      overdueFrequency: 60, // minutes
      completionCelebration: true
    }))
  );
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [lastNotifications, setLastNotifications] = useState(() => 
    JSON.parse(localStorage.getItem("lastNotifications") || "[]")
  );

  // ==================== UI STATES ====================
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ==================== PROFILE STATES ====================
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem("userAvatar") || "");
  const [userBio, setUserBio] = useState(() => localStorage.getItem("userBio") || "");
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);

  // ==================== ADVANCED FEATURES ====================
  const [projects, setProjects] = useState(() => 
    JSON.parse(localStorage.getItem("projects") || '[{"id":"inbox","name":"Inbox","color":"gray"},{"id":"work","name":"Work","color":"blue"},{"id":"personal","name":"Personal","color":"green"}]')
  );
  const [activityLog, setActivityLog] = useState(() => 
    JSON.parse(localStorage.getItem("activityLog") || '[]')
  );
  const [templates, setTemplates] = useState(() => 
    JSON.parse(localStorage.getItem("templates") || '[]')
  );
  
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroTaskId, setPomodoroTaskId] = useState(null);
  const pomodoroInterval = useRef(null);

  const [showSubtasks, setShowSubtasks] = useState({});
  const [subtaskInput, setSubtaskInput] = useState({});
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Notification intervals
  const notificationCheckInterval = useRef(null);
  const overdueCheckInterval = useRef(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const userTodos = localStorage.getItem(`todos_${currentUser.email}`);
      if (userTodos) setInput(JSON.parse(userTodos));
      
      const userProjects = localStorage.getItem(`projects_${currentUser.email}`);
      if (userProjects) setProjects(JSON.parse(userProjects));

      const userPinnedTodos = localStorage.getItem(`pinnedTodos_${currentUser.email}`);
      if (userPinnedTodos) setPinnedTodos(JSON.parse(userPinnedTodos));
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem(`todos_${currentUser.email}`, JSON.stringify(input));
    }
  }, [input, isAuthenticated, currentUser]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userAvatar", userAvatar);
    localStorage.setItem("userBio", userBio);
    localStorage.setItem("showWidget", JSON.stringify(showWidget));
    localStorage.setItem("widgetPosition", JSON.stringify(widgetPosition));
    localStorage.setItem("widgetSize", widgetSize);
    localStorage.setItem("widgetOpacity", widgetOpacity.toString());
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings));
  }, [theme, userName, userAvatar, userBio, showWidget, widgetPosition, widgetSize, widgetOpacity, notificationSettings]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem(`pinnedTodos_${currentUser.email}`, JSON.stringify(pinnedTodos));
    }
  }, [pinnedTodos, isAuthenticated, currentUser]);

  // Notification system
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    if (notificationSettings.enabled && Notification.permission === "granted") {
      // Check for due tasks every minute
      notificationCheckInterval.current = setInterval(() => {
        checkDueTodos();
      }, 60000);

      // Check for overdue tasks
      if (notificationSettings.overdueReminders) {
        overdueCheckInterval.current = setInterval(() => {
          checkOverdueTodos();
        }, notificationSettings.overdueFrequency * 60000);
      }

      // Daily digest
      if (notificationSettings.dailyDigest) {
        checkDailyDigest();
        const dailyInterval = setInterval(checkDailyDigest, 60000);
        return () => {
          clearInterval(notificationCheckInterval.current);
          clearInterval(overdueCheckInterval.current);
          clearInterval(dailyInterval);
        };
      }

      return () => {
        clearInterval(notificationCheckInterval.current);
        clearInterval(overdueCheckInterval.current);
      };
    }
  }, [input, notificationSettings, isAuthenticated]);

  // ==================== WIDGET DRAG & DROP ====================
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingWidget) {
        setWidgetPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingWidget(false);
    };

    if (isDraggingWidget) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingWidget, dragOffset]);

  const handleWidgetMouseDown = (e) => {
    if (e.target.closest('.widget-drag-handle')) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDraggingWidget(true);
    }
  };

  // ==================== NOTIFICATION FUNCTIONS ====================
  const playNotificationSound = () => {
    if (notificationSettings.sound) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn7K1aFgxEmuDyu3ElBSuBzvLXiTYIGWm98N+dTgwNUKXh8LRhGwU7k9n0yX8qBSd+zPDamkILElyx6OyrWRULRJzg8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O+zYBoFOpPY88p/KwUmfszv2ptDCxFbr+frrVoWC0Sc4PK9bSMFLITP89WFNQcZar3v4JNKDg5TquTus18aBTuU2PTKgCsGJ3/N79ucRAsSXLDn6q1aFgtDnN/yvW4jBSyEz/PVhTUHGWq97+CSSg4OU6rk7rJfGgU8lNj0yn8rByd/ze/bnEQLE1yw5+uuWhYLQ5zg8r1uIwUshM7z1YU1Bxlqve/gkkoODlOq5O+yXxoFPJPY9Mp/KwYmf83v25xECxNcr+frrloWC0Oc3/K9biMFLITP89WFNQcZar3v4JNKDg5TquTusV8aBTyU2PTKgCsGJ3/N79ucRQsTXLDn669aFgtDnN/yvW4jBSyEz/PVhTUHGWq97+CSSg4OU6rk7rJfGwU8lNj0yoArBid/ze/bnEULElyw6OytWhYLQ5zf8r1vIwUshM/z1YU1Bxlqve/gk0oODlOq5O+yYBoFPJPY9Mp/KwYmf83v25xECxNcr+jrrVoWC0Oc3/K9biMFLITO89WGNgcZar7v4JNKDg5TquTusV8aBTuU2PTKgCsGJ3/N79ucRAsTXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CSSg4OU6rk7rJfGgU8lNj0yoArBid/ze/bnEQLElyw6OytWhYLQ5zf8r1vIwUshM/z1YU1Bxlqve/gk0oODlOq5O+yXxoFPJPY9Mp/KwYmf83v25xECxNcr+frrVoWC0Oc3/K9biMFLITO89WFNQcZar7v4JNKDg5TquTusV8aBTuT2PTKgCsGJ3/N79ucRAsTXLDn669aFgtDm+DyvW4jBSyEz/PVhTUHGWq+7+CSSg4OU6rk7rJfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/gk0oODlOq5O6yXxoFO5PY9Mp/KwYnf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITP89WFNQcZar7v4JNKDg5TquTusl8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CSSg4OU6rj7rJfGwU7k9j0yn8rBid/ze/bnEQLE1yv6OyvWhcLQ5vf8r1uIwUshM/z1YU1Bxlqvu/gk0oODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITP89WFNQcZar7v4JNKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXK/o7K9aFwtDm9/yvW4jBSyEz/PVhTUHGWq+7+CSSg4OU6rk7rFfGgU7k9j0yn8rBid/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/gk0oODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9bSMFLITO89WFNQcZar7v4JRKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CSSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v4JNKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxRcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v35RKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXhoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v4JRKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v35RKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxRcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v4JRKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v35RKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxRcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v4JRKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v35RKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXhoFO5PY9Mp/KwYmf83v25xECxRcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v4JRKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU7k9j0yn8rBiZ/ze/bnEQLE1yw5+uvWhYLQ5vf8r1uIwUshM/z1YU1Bxlqvu/glEoODlOq5O6xXxoFO5PY9Mp/KwYmf83v25xECxNcsOfrr1oWC0Ob3/K9biMFLITO89WFNQcZar7v35RKDg5TquTusV8aBTuT2PTKfysGJn/N79ucRAsUXLDn669aFgtDm9/yvW4jBSyEz/PVhTUHGWq+7+CUSg4OU6rk7rFfGgU=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const sendNotification = (title, body, tag = null) => {
    if (Notification.permission === "granted" && notificationSettings.enabled) {
      const notification = new Notification(title, {
        body,
        icon: "https://cdn-icons-png.flaticon.com/512/9195/9195829.png",
        tag: tag || `notification-${Date.now()}`,
        requireInteraction: true
      });

      playNotificationSound();

      const notif = {
        id: Date.now(),
        title,
        body,
        timestamp: new Date().toISOString()
      };

      const updated = [notif, ...lastNotifications].slice(0, 50);
      setLastNotifications(updated);
      localStorage.setItem("lastNotifications", JSON.stringify(updated));

      return notification;
    }
  };

  const checkDueTodos = () => {
    if (!isAuthenticated || !notificationSettings.enabled) return;

    const now = new Date();
    const notified = JSON.parse(localStorage.getItem("notifiedTodos") || "[]");

    input.forEach(todo => {
      if (todo.dueDateTime && !todo.isCompleted && !todo.isArchived && !notified.includes(todo.id)) {
        const due = new Date(todo.dueDateTime);
        const minutesUntilDue = (due - now) / 60000;

        // Notify at exact time
        if (Math.abs(minutesUntilDue) < 1) {
          sendNotification(
            "⏰ Task Due Now!",
            todo.todo,
            `due-${todo.id}`
          );
          notified.push(todo.id);
          localStorage.setItem("notifiedTodos", JSON.stringify(notified));
        }
        // Remind before due
        else if (minutesUntilDue > 0 && minutesUntilDue <= notificationSettings.reminderBefore) {
          const key = `reminder-${todo.id}`;
          if (!notified.includes(key)) {
            sendNotification(
              `⏳ Task Due in ${Math.round(minutesUntilDue)} minutes`,
              todo.todo,
              key
            );
            notified.push(key);
            localStorage.setItem("notifiedTodos", JSON.stringify(notified));
          }
        }
      }
    });
  };

  const checkOverdueTodos = () => {
    if (!isAuthenticated || !notificationSettings.overdueReminders) return;

    const now = new Date();
    const overdueTodos = input.filter(t => 
      t.dueDateTime && 
      !t.isCompleted && 
      !t.isArchived && 
      new Date(t.dueDateTime) < now
    );

    if (overdueTodos.length > 0) {
      sendNotification(
        `🚨 ${overdueTodos.length} Overdue Task${overdueTodos.length > 1 ? 's' : ''}`,
        overdueTodos.slice(0, 3).map(t => t.todo).join(', '),
        'overdue-reminder'
      );
    }
  };

  const checkDailyDigest = () => {
    if (!isAuthenticated || !notificationSettings.dailyDigest) return;

    const now = new Date();
    const digestTime = notificationSettings.digestTime.split(':');
    const digestHour = parseInt(digestTime[0]);
    const digestMinute = parseInt(digestTime[1]);

    if (now.getHours() === digestHour && now.getMinutes() === digestMinute) {
      const lastDigest = localStorage.getItem('lastDailyDigest');
      const today = now.toDateString();

      if (lastDigest !== today) {
        const todayTasks = input.filter(t => 
          t.dueDateTime && 
          !t.isArchived &&
          new Date(t.dueDateTime).toDateString() === today
        );

        sendNotification(
          "📅 Daily Digest",
          `You have ${todayTasks.length} task${todayTasks.length !== 1 ? 's' : ''} due today`,
          'daily-digest'
        );

        localStorage.setItem('lastDailyDigest', today);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        setNotificationSettings({ ...notificationSettings, enabled: true });
        sendNotification(
          "🎉 Notifications Enabled!",
          "You'll now get reminders for your todos!"
        );
      }
    }
  };

  // ==================== WIDGET FUNCTIONS ====================
  const togglePinTodo = (todoId) => {
    if (pinnedTodos.includes(todoId)) {
      setPinnedTodos(pinnedTodos.filter(id => id !== todoId));
    } else {
      setPinnedTodos([...pinnedTodos, todoId]);
    }
  };

  const getPinnedTodoItems = () => {
    return input.filter(t => pinnedTodos.includes(t.id) && !t.isArchived);
  };

  const getWidgetSizeClass = () => {
    switch (widgetSize) {
      case "small": return "w-64";
      case "medium": return "w-80";
      case "large": return "w-96";
      default: return "w-80";
    }
  };

  // ==================== AUTH FUNCTIONS ====================
  const handleAuth = () => {
    if (authMode === "login") {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === authEmail && u.password === authPassword);
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        setShowAuthModal(false);
        addActivity("Logged in successfully");
      } else {
        alert("Invalid credentials!");
      }
    } else {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.email === authEmail)) {
        alert("Email already exists!");
        return;
      }
      
      const newUser = {
        id: Date.now(),
        email: authEmail,
        password: authPassword,
        name: authName,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setUserName(authName);
      setShowAuthModal(false);
      addActivity("Account created successfully");
    }
    
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("currentUser");
    setInput([]);
    setShowWidget(false);
    setPinnedTodos([]);
    addActivity("Logged out");
  };

  // ==================== ACTIVITY LOG ====================
  const addActivity = (action, todoTitle = null) => {
    const activity = {
      id: Date.now(),
      action,
      todoTitle,
      timestamp: new Date().toISOString(),
      user: currentUser?.email || "Guest"
    };
    const updated = [activity, ...activityLog].slice(0, 100);
    setActivityLog(updated);
    localStorage.setItem("activityLog", JSON.stringify(updated));
  };

  // ==================== TODO FUNCTIONS ====================
  const saveToLS = (todos) => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem(`todos_${currentUser.email}`, JSON.stringify(todos));
    }
  };

  const handleAdd = () => {
    if (!todo.trim()) return;
    
    const dueDateTime = dueDate && dueTime 
      ? new Date(`${dueDate}T${dueTime}`).toISOString() 
      : null;

    if (editId) {
      const updated = input.map(t => 
        t.id === editId 
          ? { 
              ...t, 
              todo: todo.trim(), 
              description: todoDescription.trim(),
              priority, 
              category, 
              dueDateTime,
              tags,
              project: selectedProject,
              isRecurring,
              recurringType: isRecurring ? recurringType : null,
              estimatedTime,
              updatedAt: new Date().toISOString()
            } 
          : t
      );
      setInput(updated);
      saveToLS(updated);
      addActivity("Updated task", todo.trim());
      setEditId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        todo: todo.trim(),
        description: todoDescription.trim(),
        isCompleted: false,
        isArchived: false,
        isFavorite: false,
        priority,
        category,
        tags,
        project: selectedProject,
        createdAt: new Date().toISOString(),
        dueDateTime,
        isRecurring,
        recurringType: isRecurring ? recurringType : null,
        estimatedTime,
        actualTime: 0,
        subtasks: []
      };
      const updated = [...input, newTodo];
      setInput(updated);
      saveToLS(updated);
      addActivity("Created task", todo.trim());
    }
    
    resetForm();
  };

  const resetForm = () => {
    setTodo("");
    setTodoDescription("");
    setPriority("medium");
    setCategory("personal");
    setDueDate("");
    setDueTime("");
    setTags([]);
    setIsRecurring(false);
    setEstimatedTime("");
  };

  const handleEdit = (id) => {
    const t = input.find(i => i.id === id);
    if (t) {
      setTodo(t.todo);
      setTodoDescription(t.description || "");
      setPriority(t.priority);
      setCategory(t.category || "personal");
      setTags(t.tags || []);
      setSelectedProject(t.project || "inbox");
      setIsRecurring(t.isRecurring || false);
      setRecurringType(t.recurringType || "daily");
      setEstimatedTime(t.estimatedTime || "");
      
      if (t.dueDateTime) {
        const d = new Date(t.dueDateTime);
        setDueDate(d.toISOString().split('T')[0]);
        setDueTime(d.toTimeString().slice(0, 5));
      }
      setEditId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = (id) => {
    const todo = input.find(t => t.id === id);
    const updated = input.filter(t => t.id !== id);
    setInput(updated);
    saveToLS(updated);
    setPinnedTodos(pinnedTodos.filter(pid => pid !== id));
    addActivity("Deleted task", todo?.todo);
  };

  const handleToggleComplete = (id) => {
    const updated = input.map(t => {
      if (t.id === id) {
        const newStatus = !t.isCompleted;
        addActivity(newStatus ? "Completed task" : "Uncompleted task", t.todo);
        
        if (newStatus && notificationSettings.completionCelebration) {
          sendNotification(
            "✅ Task Completed!",
            t.todo,
            `completed-${t.id}`
          );
        }
        
        if (newStatus && t.isRecurring) {
          createRecurringTask(t);
        }
        
        return { ...t, isCompleted: newStatus, completedAt: newStatus ? new Date().toISOString() : null };
      }
      return t;
    });
    setInput(updated);
    saveToLS(updated);
  };

  const createRecurringTask = (task) => {
    const newDue = new Date(task.dueDateTime);
    
    switch (task.recurringType) {
      case 'daily':
        newDue.setDate(newDue.getDate() + 1);
        break;
      case 'weekly':
        newDue.setDate(newDue.getDate() + 7);
        break;
      case 'monthly':
        newDue.setMonth(newDue.getMonth() + 1);
        break;
      case 'yearly':
        newDue.setFullYear(newDue.getFullYear() + 1);
        break;
    }
    
    const newTask = {
      ...task,
      id: Date.now(),
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      dueDateTime: newDue.toISOString()
    };
    
    const updated = [...input, newTask];
    setInput(updated);
    saveToLS(updated);
  };

  const handleToggleFavorite = (id) => {
    const updated = input.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    );
    setInput(updated);
    saveToLS(updated);
  };

  const handleArchive = (id) => {
    const todo = input.find(t => t.id === id);
    const updated = input.map(t => 
      t.id === id ? { ...t, isArchived: !t.isArchived } : t
    );
    setInput(updated);
    saveToLS(updated);
    addActivity(todo?.isArchived ? "Unarchived task" : "Archived task", todo?.todo);
  };

  const handleDuplicate = (id) => {
    const todo = input.find(t => t.id === id);
    if (todo) {
      const duplicate = {
        ...todo,
        id: Date.now(),
        todo: `${todo.todo} (Copy)`,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      const updated = [...input, duplicate];
      setInput(updated);
      saveToLS(updated);
      addActivity("Duplicated task", todo.todo);
    }
  };

  // ==================== SUBTASKS ====================
  const addSubtask = (todoId) => {
    const subtaskText = subtaskInput[todoId];
    if (!subtaskText?.trim()) return;
    
    const updated = input.map(t => {
      if (t.id === todoId) {
        const subtasks = t.subtasks || [];
        return {
          ...t,
          subtasks: [...subtasks, {
            id: Date.now(),
            text: subtaskText.trim(),
            isCompleted: false
          }]
        };
      }
      return t;
    });
    
    setInput(updated);
    saveToLS(updated);
    setSubtaskInput({ ...subtaskInput, [todoId]: "" });
  };

  const toggleSubtask = (todoId, subtaskId) => {
    const updated = input.map(t => {
      if (t.id === todoId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => 
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
          )
        };
      }
      return t;
    });
    setInput(updated);
    saveToLS(updated);
  };

  const deleteSubtask = (todoId, subtaskId) => {
    const updated = input.map(t => {
      if (t.id === todoId) {
        return {
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== subtaskId)
        };
      }
      return t;
    });
    setInput(updated);
    saveToLS(updated);
  };

  // ==================== TAGS ====================
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  // ==================== EXPORT/IMPORT ====================
  const exportData = () => {
    const data = {
      todos: input,
      projects,
      templates,
      pinnedTodos,
      exportedAt: new Date().toISOString(),
      version: "2.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addActivity("Exported data");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.todos) {
            setInput(data.todos);
            saveToLS(data.todos);
          }
          if (data.projects) setProjects(data.projects);
          if (data.templates) setTemplates(data.templates);
          if (data.pinnedTodos) setPinnedTodos(data.pinnedTodos);
          addActivity("Imported data");
          alert("Data imported successfully!");
        } catch (error) {
          alert("Error importing data!");
        }
      };
      reader.readAsText(file);
    }
  };

  const saveAsTemplate = (id) => {
    const todo = input.find(t => t.id === id);
    if (todo) {
      const template = {
        id: Date.now(),
        name: todo.todo,
        todo: todo.todo,
        description: todo.description,
        priority: todo.priority,
        category: todo.category,
        tags: todo.tags,
        estimatedTime: todo.estimatedTime
      };
      const updated = [...templates, template];
      setTemplates(updated);
      localStorage.setItem("templates", JSON.stringify(updated));
      alert("Template saved!");
    }
  };

  const loadTemplate = (template) => {
    setTodo(template.todo);
    setTodoDescription(template.description || "");
    setPriority(template.priority);
    setCategory(template.category);
    setTags(template.tags || []);
    setEstimatedTime(template.estimatedTime || "");
  };

  // ==================== FILTERING & SORTING ====================
  const filteredTodos = input
    .filter(t => showArchived ? t.isArchived : !t.isArchived)
    .filter(t => {
      if (filter === "all") return true;
      if (filter === "active") return !t.isCompleted;
      if (filter === "completed") return t.isCompleted;
      if (filter === "favorite") return t.isFavorite;
      if (filter === "today") {
        if (!t.dueDateTime) return false;
        const today = new Date().toDateString();
        return new Date(t.dueDateTime).toDateString() === today;
      }
      if (filter === "overdue") {
        if (!t.dueDateTime || t.isCompleted) return false;
        return new Date(t.dueDateTime) < new Date();
      }
      if (filter === "week") {
        if (!t.dueDateTime) return false;
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return new Date(t.dueDateTime) <= weekFromNow;
      }
      return true;
    })
    .filter(t => selectedProject === "all" || t.project === selectedProject)
    .filter(t => (t.todo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      const p = { high: 3, medium: 2, low: 1 };
      if (p[a.priority] !== p[b.priority]) return p[b.priority] - p[a.priority];
      
      if (a.dueDateTime && b.dueDateTime) {
        return new Date(a.dueDateTime) - new Date(b.dueDateTime);
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // ==================== STATISTICS ====================
  const stats = {
    total: input.filter(t => !t.isArchived).length,
    active: input.filter(t => !t.isCompleted && !t.isArchived).length,
    completed: input.filter(t => t.isCompleted && !t.isArchived).length,
    archived: input.filter(t => t.isArchived).length,
    overdue: input.filter(t => 
      t.dueDateTime && 
      !t.isCompleted && 
      !t.isArchived && 
      new Date(t.dueDateTime) < new Date()
    ).length,
    today: input.filter(t => 
      t.dueDateTime && 
      !t.isArchived &&
      new Date(t.dueDateTime).toDateString() === new Date().toDateString()
    ).length,
    completionRate: input.filter(t => !t.isArchived).length > 0
      ? Math.round((input.filter(t => t.isCompleted && !t.isArchived).length / 
          input.filter(t => !t.isArchived).length) * 100)
      : 0
  };

  // ==================== THEME ====================
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
  const cardBg = isDark ? "bg-slate-800/95" : "bg-white/95";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const inputBg = isDark ? "bg-slate-700/70 border-slate-600" : "bg-white border-slate-300";
  const hoverBg = isDark ? "hover:bg-slate-700" : "hover:bg-slate-100";

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          .float { animation: float 6s ease-in-out infinite; }
          .glass { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        `}</style>
        
        <div className={`${cardBg} glass rounded-3xl shadow-2xl border ${borderColor} p-10 max-w-md w-full`}>
          <div className="text-center mb-8">
            <div className="inline-block float">
              <CheckCircle2 size={80} className="text-indigo-600 mb-4" />
            </div>
            <h1 className={`text-4xl font-black ${textPrimary} mb-2`}>
              Todo <span className="text-indigo-600">Pro</span>
            </h1>
            <p className={textSecondary}>Your professional task management solution</p>
          </div>

          <div className="space-y-4">
            {authMode === "register" && (
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Full Name</label>
                <div className="relative">
                  <User size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                  <input
                    type="text"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Email</label>
              <div className="relative">
                <Mail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Password</label>
              <div className="relative">
                <Lock size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${textSecondary}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAuth}
              disabled={!authEmail || !authPassword || (authMode === "register" && !authName)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authMode === "login" ? "Sign In" : "Create Account"}
            </button>

            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthEmail("");
                setAuthPassword("");
                setAuthName("");
              }}
              className={`w-full ${textSecondary} text-center py-2 hover:text-indigo-600 transition-colors`}
            >
              {authMode === "login" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${hoverBg} transition-colors ${textPrimary}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              Switch to {isDark ? "Light" : "Dark"} Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN APP ====================
  return (
    <div className={`min-h-screen ${bgGradient} transition-all duration-500`}>
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pulse { animation: pulse 2s infinite; }
        .glass { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .slide-in { animation: slideIn 0.3s ease-out; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: ${isDark ? '#4a5568' : '#cbd5e0'}; 
          border-radius: 4px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#718096' : '#a0aec0'}; }
      `}</style>

      {/* ==================== FLOATING WIDGET ==================== */}
      {showWidget && getPinnedTodoItems().length > 0 && (
        <div
          ref={widgetRef}
          onMouseDown={handleWidgetMouseDown}
          className={`fixed ${getWidgetSizeClass()} ${cardBg} glass rounded-2xl shadow-2xl border-2 ${borderColor} z-50 transition-all`}
          style={{
            left: `${widgetPosition.x}px`,
            top: `${widgetPosition.y}px`,
            opacity: widgetOpacity,
            cursor: isDraggingWidget ? 'grabbing' : 'default'
          }}
        >
          {/* Widget Header */}
          <div className={`p-4 border-b ${borderColor} flex items-center justify-between widget-drag-handle cursor-move`}>
            <div className="flex items-center gap-2">
              <Pin size={18} className="text-indigo-500" />
              <h3 className={`font-bold ${textPrimary}`}>Pinned Tasks</h3>
              <span className={`text-xs ${textSecondary}`}>({getPinnedTodoItems().length})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWidgetCollapsed(!widgetCollapsed)}
                className={`p-1 rounded ${hoverBg}`}
              >
                {widgetCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setShowWidgetSettings(true)}
                className={`p-1 rounded ${hoverBg}`}
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setShowWidget(false)}
                className={`p-1 rounded ${hoverBg}`}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Widget Content */}
          {!widgetCollapsed && (
            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {getPinnedTodoItems().map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border ${borderColor} ${cardBg} ${hoverBg} transition-all`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className={`min-w-[20px] w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-slate-400"
                      }`}
                    >
                      {item.isCompleted && <Check size={12} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          item.isCompleted ? "line-through opacity-60" : textPrimary
                        } truncate`}
                      >
                        {item.todo}
                      </p>
                      {item.dueDateTime && (
                        <p
                          className={`text-xs ${textSecondary} flex items-center gap-1 mt-1 ${
                            !item.isCompleted && new Date(item.dueDateTime) < new Date()
                              ? "text-red-500 font-bold"
                              : ""
                          }`}
                        >
                          <Clock size={12} />
                          {new Date(item.dueDateTime).toLocaleDateString()} {new Date(item.dueDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className={`p-1 rounded ${hoverBg}`}
                      >
                        <Edit2 size={14} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => togglePinTodo(item.id)}
                        className={`p-1 rounded ${hoverBg}`}
                      >
                        <PinOff size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  {item.subtasks && item.subtasks.length > 0 && (
                    <div className="mt-2 ml-7 text-xs ${textSecondary}">
                      {item.subtasks.filter(st => st.isCompleted).length}/{item.subtasks.length} subtasks
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} ${cardBg} glass border-r ${borderColor} transition-all duration-300 flex flex-col`}>
          {/* Profile Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {userName[0]?.toUpperCase() || currentUser?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={`font-bold ${textPrimary} truncate`}>{userName || currentUser?.name || "User"}</p>
                  <p className={`text-sm ${textSecondary} truncate`}>{currentUser?.email}</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${hoverBg}`}
              >
                <Layout size={20} className={textPrimary} />
              </button>
            </div>
          </div>

          {/* Projects */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className={`text-xs font-bold uppercase ${textSecondary} mb-3`}>Projects</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedProject("all")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    selectedProject === "all" 
                      ? "bg-indigo-600 text-white" 
                      : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <Layers size={18} />
                  <span className="flex-1 text-left">All Tasks</span>
                  <span className="text-xs">{input.filter(t => !t.isArchived).length}</span>
                </button>
                
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      selectedProject === project.id 
                        ? "bg-indigo-600 text-white" 
                        : `${textPrimary} ${hoverBg}`
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${project.color}-500`}></div>
                    <span className="flex-1 text-left">{project.name}</span>
                    <span className="text-xs">
                      {input.filter(t => t.project === project.id && !t.isArchived).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Filters */}
              <h3 className={`text-xs font-bold uppercase ${textSecondary} mt-6 mb-3`}>Quick Filters</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setFilter("today")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    filter === "today" ? "bg-indigo-600 text-white" : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <CalendarDays size={18} />
                  <span className="flex-1 text-left">Today</span>
                  <span className="text-xs">{stats.today}</span>
                </button>
                
                <button
                  onClick={() => setFilter("overdue")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    filter === "overdue" ? "bg-red-600 text-white" : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <AlertCircle size={18} />
                  <span className="flex-1 text-left">Overdue</span>
                  <span className="text-xs">{stats.overdue}</span>
                </button>
                
                <button
                  onClick={() => setFilter("favorite")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    filter === "favorite" ? "bg-yellow-600 text-white" : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <Star size={18} />
                  <span className="flex-1 text-left">Favorites</span>
                  <span className="text-xs">{input.filter(t => t.isFavorite && !t.isArchived).length}</span>
                </button>
              </div>

              {/* Widget Control */}
              <h3 className={`text-xs font-bold uppercase ${textSecondary} mt-6 mb-3`}>Widget</h3>
              <button
                onClick={() => setShowWidget(!showWidget)}
                disabled={pinnedTodos.length === 0}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  showWidget ? "bg-purple-600 text-white" : `${textPrimary} ${hoverBg}`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Pin size={18} />
                <span className="flex-1 text-left">
                  {showWidget ? "Hide" : "Show"} Widget
                </span>
                <span className="text-xs">{pinnedTodos.length}</span>
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className={`p-4 border-t ${borderColor} space-y-2`}>
            {!sidebarCollapsed && (
              <>
                <button
                  onClick={() => setShowNotificationSettings(true)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${hoverBg} ${textPrimary}`}
                >
                  <BellRing size={18} />
                  Notifications
                  {notificationSettings.enabled && (
                    <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => setShowAnalytics(true)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${hoverBg} ${textPrimary}`}
                >
                  <BarChart3 size={18} />
                  Analytics
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${hoverBg} ${textPrimary}`}
                >
                  <Settings size={18} />
                  Settings
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2 rounded-lg ${hoverBg} text-red-500`}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && "Logout"}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className={`text-5xl font-black ${textPrimary} mb-2`}>
                  {selectedProject === "all" ? "All Tasks" : projects.find(p => p.id === selectedProject)?.name}
                </h1>
                <p className={textSecondary}>
                  {stats.active} active • {stats.completed} completed • {stats.completionRate}% completion rate
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Notification Status */}
                {notificationPermission !== "granted" && (
                  <button
                    onClick={requestNotificationPermission}
                    className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500 text-yellow-600 hover:bg-yellow-500/30 transition-all"
                    title="Enable Notifications"
                  >
                    <Bell size={20} />
                  </button>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={`p-3 rounded-xl ${cardBg} border ${borderColor} ${hoverBg} transition-all`}
                >
                  {isDark ? <Sun size={20} className={textPrimary} /> : <Moon size={20} className={textPrimary} />}
                </button>

                {/* Export */}
                <button
                  onClick={exportData}
                  className={`p-3 rounded-xl ${cardBg} border ${borderColor} ${hoverBg} transition-all`}
                  title="Export Data"
                >
                  <Download size={20} className={textPrimary} />
                </button>

                {/* Import */}
                <label className={`p-3 rounded-xl ${cardBg} border ${borderColor} ${hoverBg} transition-all cursor-pointer`} title="Import Data">
                  <Upload size={20} className={textPrimary} />
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total", value: stats.total, icon: List, color: "blue" },
                { label: "Active", value: stats.active, icon: Clock, color: "purple" },
                { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "green" },
                { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "red" }
              ].map((stat, i) => (
                <div key={i} className={`${cardBg} glass rounded-2xl p-6 border ${borderColor} slide-in`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={24} className={`text-${stat.color}-500`} />
                    <span className={`text-3xl font-black ${textPrimary}`}>{stat.value}</span>
                  </div>
                  <p className={`text-sm ${textSecondary}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Add Todo Form */}
            <div className={`${cardBg} glass rounded-3xl shadow-2xl border ${borderColor} p-8 mb-8`}>
              <div className="flex items-center gap-4 mb-6">
                <Zap size={28} className="text-indigo-500" />
                <h2 className={`text-2xl font-bold ${textPrimary}`}>
                  {editId ? "Edit Task" : "Add New Task"}
                </h2>
              </div>

              <input
                type="text"
                value={todo}
                onChange={e => setTodo(e.target.value)}
                onKeyPress={e => e.key === "Enter" && !e.shiftKey && handleAdd()}
                placeholder="What needs to be done?"
                className={`w-full px-6 py-4 text-xl rounded-xl border-2 ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none mb-4`}
              />

              <textarea
                value={todoDescription}
                onChange={e => setTodoDescription(e.target.value)}
                placeholder="Add description (optional)"
                rows={3}
                className={`w-full px-6 py-4 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none resize-none mb-4`}
              />

              {/* Tags */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className={textSecondary} />
                  <span className={`text-sm font-medium ${textSecondary}`}>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-600 rounded-full text-sm"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && addTag()}
                    placeholder="Add tag..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>

                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                >
                  <option value="personal">👤 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">❤️ Health</option>
                  <option value="learning">📚 Learning</option>
                  <option value="finance">💰 Finance</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />

                <input
                  type="time"
                  value={dueTime}
                  onChange={e => setDueTime(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />

                <input
                  type="text"
                  value={estimatedTime}
                  onChange={e => setEstimatedTime(e.target.value)}
                  placeholder="Est. time (e.g. 2h)"
                  className={`px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />
              </div>

              {/* Recurring */}
              <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={e => setIsRecurring(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={textPrimary}>Recurring Task</span>
                </label>

                {isRecurring && (
                  <select
                    value={recurringType}
                    onChange={e => setRecurringType(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${inputBg} ${textPrimary}`}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAdd}
                  disabled={!todo.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {editId ? "Update Task" : "Add Task"}
                </button>

                {editId && (
                  <button
                    onClick={() => {
                      setEditId(null);
                      resetForm();
                    }}
                    className={`px-6 py-4 rounded-xl border ${borderColor} ${textPrimary} hover:bg-red-500 hover:text-white transition-all`}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Templates */}
              {templates.length > 0 && (
                <div className="mt-6">
                  <p className={`text-sm font-medium ${textSecondary} mb-2`}>Quick Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => loadTemplate(template)}
                        className={`px-4 py-2 rounded-lg border ${borderColor} ${textPrimary} ${hoverBg} text-sm`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters & Search */}
            <div className={`${cardBg} glass rounded-2xl border ${borderColor} p-6 mb-6 flex flex-wrap gap-4 items-center`}>
              <div className="flex-1 min-w-64 relative">
                <Search size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${inputBg} ${textPrimary} focus:border-indigo-500 focus:outline-none`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "active", "completed", "today", "week", "overdue"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === f
                        ? "bg-indigo-600 text-white"
                        : `${cardBg} ${textPrimary} border ${borderColor} ${hoverBg}`
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-indigo-600 text-white" : textPrimary}`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-indigo-600 text-white" : textPrimary}`}
                >
                  <Grid size={18} />
                </button>
              </div>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                  showArchived ? "bg-orange-600 text-white" : `${cardBg} ${textPrimary} border ${borderColor}`
                }`}
              >
                <Archive size={18} />
                {showArchived ? "Hide" : "Show"} Archived
              </button>
            </div>

            {/* Todo List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {filteredTodos.length === 0 ? (
                <div className={`${cardBg} glass rounded-3xl border ${borderColor} p-20 text-center`}>
                  <CheckCircle2 size={80} className={`${textSecondary} mx-auto mb-6 opacity-50`} />
                  <p className={`text-2xl ${textSecondary}`}>
                    {searchTerm 
                      ? "No tasks found" 
                      : showArchived 
                      ? "No archived tasks" 
                      : "No tasks yet. Create your first task!"}
                  </p>
                </div>
              ) : (
                filteredTodos.map(item => (
                  <div
                    key={item.id}
                    className={`${cardBg} glass rounded-2xl border ${
                      item.isFavorite ? "border-yellow-500" : borderColor
                    } p-6 hover:shadow-2xl transition-all group slide-in ${
                      item.isCompleted ? "opacity-75" : ""
                    } ${pinnedTodos.includes(item.id) ? "ring-2 ring-purple-500" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={`min-w-[28px] w-7 h-7 mt-1 rounded-full border-3 flex items-center justify-center transition-all ${
                          item.isCompleted
                            ? "bg-green-500 border-green-500"
                            : "border-slate-400 hover:border-indigo-500"
                        }`}
                      >
                        {item.isCompleted && <Check size={18} className="text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`text-xl font-bold ${
                              item.isCompleted ? "line-through opacity-60" : textPrimary
                            }`}
                          >
                            {item.todo}
                          </h3>
                          
                          <div className="flex items-center gap-2">
                            {pinnedTodos.includes(item.id) && (
                              <Pin size={16} className="text-purple-500" />
                            )}
                            <span
                              className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                                item.priority === "high"
                                  ? "bg-red-500/20 text-red-600"
                                  : item.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-600"
                                  : "bg-green-500/20 text-green-600"
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>

                        {item.description && (
                          <p className={`${textSecondary} text-sm mb-3`}>{item.description}</p>
                        )}

                        <div className={`flex flex-wrap gap-3 text-sm ${textSecondary} mb-3`}>
                          <span className="capitalize flex items-center gap-1">
                            <FolderOpen size={14} />
                            {item.category}
                          </span>
                          
                          {item.dueDateTime && (
                            <span
                              className={`flex items-center gap-1 ${
                                !item.isCompleted && new Date(item.dueDateTime) < new Date()
                                  ? "text-red-500 font-bold"
                                  : ""
                              }`}
                            >
                              <Calendar size={14} />
                              {new Date(item.dueDateTime).toLocaleDateString()} {new Date(item.dueDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          )}

                          {item.estimatedTime && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {item.estimatedTime}
                            </span>
                          )}

                          {item.isRecurring && (
                            <span className="flex items-center gap-1 text-purple-500">
                              <Repeat size={14} />
                              {item.recurringType}
                            </span>
                          )}
                        </div>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-indigo-500/20 text-indigo-600 rounded-md text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.subtasks && item.subtasks.length > 0 && (
                          <div className="mb-3">
                            <button
                              onClick={() =>
                                setShowSubtasks({
                                  ...showSubtasks,
                                  [item.id]: !showSubtasks[item.id]
                                })
                              }
                              className={`flex items-center gap-2 text-sm ${textSecondary} hover:text-indigo-600 mb-2`}
                            >
                              {showSubtasks[item.id] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                              Subtasks ({item.subtasks.filter(st => st.isCompleted).length}/
                              {item.subtasks.length})
                            </button>

                            {showSubtasks[item.id] && (
                              <div className="space-y-2 ml-6">
                                {item.subtasks.map(subtask => (
                                  <div key={subtask.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={subtask.isCompleted}
                                      onChange={() => toggleSubtask(item.id, subtask.id)}
                                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                                    />
                                    <span
                                      className={`flex-1 text-sm ${
                                        subtask.isCompleted
                                          ? "line-through opacity-60"
                                          : textPrimary
                                      }`}
                                    >
                                      {subtask.text}
                                    </span>
                                    <button
                                      onClick={() => deleteSubtask(item.id, subtask.id)}
                                      className="text-red-500 opacity-0 group-hover:opacity-100"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ))}

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={subtaskInput[item.id] || ""}
                                    onChange={e =>
                                      setSubtaskInput({
                                        ...subtaskInput,
                                        [item.id]: e.target.value
                                      })
                                    }
                                    onKeyPress={e =>
                                      e.key === "Enter" && addSubtask(item.id)
                                    }
                                    placeholder="Add subtask..."
                                    className={`flex-1 px-3 py-1 text-sm rounded-lg border ${inputBg} ${textPrimary}`}
                                  />
                                  <button
                                    onClick={() => addSubtask(item.id)}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {item.subtasks && item.subtasks.length > 0 && (
                          <div className="mb-3">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${
                                    (item.subtasks.filter(st => st.isCompleted).length /
                                      item.subtasks.length) *
                                    100
                                  }%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => togglePinTodo(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title={pinnedTodos.includes(item.id) ? "Unpin from Widget" : "Pin to Widget"}
                          >
                            {pinnedTodos.includes(item.id) ? (
                              <PinOff size={18} className="text-purple-500" />
                            ) : (
                              <Pin size={18} className={textSecondary} />
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleFavorite(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Favorite"
                          >
                            <Star
                              size={18}
                              className={
                                item.isFavorite
                                  ? "fill-yellow-500 text-yellow-500"
                                  : textSecondary
                              }
                            />
                          </button>

                          <button
                            onClick={() => handleEdit(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-blue-500" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Duplicate"
                          >
                            <Copy size={18} className="text-purple-500" />
                          </button>

                          <button
                            onClick={() => saveAsTemplate(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Save as Template"
                          >
                            <Save size={18} className="text-green-500" />
                          </button>

                          <button
                            onClick={() => handleArchive(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Archive"
                          >
                            <Archive size={18} className="text-orange-500" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={`text-center mt-12 ${textSecondary}`}>
              <p className="text-lg">
                Made with ❤️ • {stats.completed} tasks completed • Keep crushing it!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== WIDGET SETTINGS MODAL ==================== */}
      {showWidgetSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowWidgetSettings(false)}
          ></div>
          <div
            className={`${cardBg} glass border ${borderColor} rounded-3xl shadow-2xl p-10 max-w-md w-full relative`}
          >
            <button
              onClick={() => setShowWidgetSettings(false)}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/20 transition"
            >
              <X size={28} className={textPrimary} />
            </button>

            <h2 className={`text-3xl font-bold ${textPrimary} mb-8`}>Widget Settings</h2>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>Widget Size</label>
                <select
                  value={widgetSize}
                  onChange={e => setWidgetSize(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Opacity: {Math.round(widgetOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={widgetOpacity}
                  onChange={e => setWidgetOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <p className={`text-sm ${textSecondary} mb-2`}>
                  Pinned Tasks: {pinnedTodos.length}
                </p>
                <button
                  onClick={() => {
                    setPinnedTodos([]);
                    setShowWidget(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                >
                  Clear All Pinned Tasks
                </button>
              </div>

              <div className={`p-4 bg-blue-500/10 border border-blue-500 rounded-xl ${textPrimary}`}>
                <p className="text-sm">
                  💡 <strong>Tip:</strong> Click and drag the widget header to move it around the screen!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== NOTIFICATION SETTINGS MODAL ==================== */}
      {showNotificationSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowNotificationSettings(false)}
          ></div>
          <div
            className={`${cardBg} glass border ${borderColor} rounded-3xl shadow-2xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative`}
          >
            <button
              onClick={() => setShowNotificationSettings(false)}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/20 transition"
            >
              <X size={28} className={textPrimary} />
            </button>

            <h2 className={`text-3xl font-bold ${textPrimary} mb-8 flex items-center gap-3`}>
              <BellRing size={32} className="text-indigo-500" />
              Notification Settings
            </h2>

            <div className="space-y-6">
              {/* Enable Notifications */}
              <div className={`p-4 rounded-xl border ${borderColor} flex items-center justify-between`}>
                <div>
                  <p className={`font-bold ${textPrimary}`}>Enable Notifications</p>
                  <p className={`text-sm ${textSecondary}`}>
                    {notificationPermission === "granted" ? "Granted" : "Permission needed"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (notificationPermission !== "granted") {
                      requestNotificationPermission();
                    } else {
                      setNotificationSettings({
                        ...notificationSettings,
                        enabled: !notificationSettings.enabled
                      });
                    }
                  }}
                  className={`px-6 py-3 rounded-xl font-bold ${
                    notificationSettings.enabled
                      ? "bg-green-500 text-white"
                      : "bg-slate-500 text-white"
                  }`}
                >
                  {notificationSettings.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Sound */}
              <div className={`p-4 rounded-xl border ${borderColor} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {notificationSettings.sound ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  <div>
                    <p className={`font-bold ${textPrimary}`}>Notification Sound</p>
                    <p className={`text-sm ${textSecondary}`}>Play sound with notifications</p>
                  </div>
                </div>
                <label className="relative inline-block w-14 h-8">
                  <input
                    type="checkbox"
                    checked={notificationSettings.sound}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        sound: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></span>
                  <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                </label>
              </div>

              {/* Reminder Before Due */}
              <div className={`p-4 rounded-xl border ${borderColor}`}>
                <label className={`block font-bold ${textPrimary} mb-2`}>
                  Remind Before Due
                </label>
                <select
                  value={notificationSettings.reminderBefore}
                  onChange={e =>
                    setNotificationSettings({
                      ...notificationSettings,
                      reminderBefore: parseInt(e.target.value)
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="1440">1 day</option>
                </select>
              </div>

              {/* Daily Digest */}
              <div className={`p-4 rounded-xl border ${borderColor}`}>
                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={notificationSettings.dailyDigest}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        dailyDigest: e.target.checked
                      })
                    }
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                  />
                  <div>
                    <p className={`font-bold ${textPrimary}`}>Daily Digest</p>
                    <p className={`text-sm ${textSecondary}`}>Get daily summary of tasks</p>
                  </div>
                </label>

                {notificationSettings.dailyDigest && (
                  <input
                    type="time"
                    value={notificationSettings.digestTime}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        digestTime: e.target.value
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}
                  />
                )}
              </div>

              {/* Overdue Reminders */}
              <div className={`p-4 rounded-xl border ${borderColor}`}>
                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={notificationSettings.overdueReminders}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        overdueReminders: e.target.checked
                      })
                    }
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                  />
                  <div>
                    <p className={`font-bold ${textPrimary}`}>Overdue Reminders</p>
                    <p className={`text-sm ${textSecondary}`}>Periodic reminders for overdue tasks</p>
                  </div>
                </label>

                {notificationSettings.overdueReminders && (
                  <select
                    value={notificationSettings.overdueFrequency}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        overdueFrequency: parseInt(e.target.value)
                      })
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${inputBg} ${textPrimary}`}
                  >
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                    <option value="120">Every 2 hours</option>
                    <option value="360">Every 6 hours</option>
                  </select>
                )}
              </div>

              {/* Completion Celebration */}
              <div className={`p-4 rounded-xl border ${borderColor} flex items-center justify-between`}>
                <div>
                  <p className={`font-bold ${textPrimary}`}>Completion Celebration</p>
                  <p className={`text-sm ${textSecondary}`}>Celebrate when you complete tasks</p>
                </div>
                <label className="relative inline-block w-14 h-8">
                  <input
                    type="checkbox"
                    checked={notificationSettings.completionCelebration}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        completionCelebration: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></span>
                  <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                </label>
              </div>

              {/* Recent Notifications */}
              {lastNotifications.length > 0 && (
                <div>
                  <h3 className={`font-bold ${textPrimary} mb-3`}>Recent Notifications</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {lastNotifications.slice(0, 10).map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg ${cardBg} border ${borderColor} text-sm`}
                      >
                        <p className={`font-bold ${textPrimary}`}>{notif.title}</p>
                        <p className={textSecondary}>{notif.body}</p>
                        <p className={`text-xs ${textSecondary} mt-1`}>
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Notification */}
              <button
                onClick={() =>
                  sendNotification("🧪 Test Notification", "This is how your notifications will look!")
                }
                disabled={!notificationSettings.enabled}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ANALYTICS MODAL ==================== */}
      {showAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAnalytics(false)}
          ></div>
          <div
            className={`${cardBg} glass border ${borderColor} rounded-3xl shadow-2xl p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative`}
          >
            <button
              onClick={() => setShowAnalytics(false)}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/20 transition"
            >
              <X size={28} className={textPrimary} />
            </button>

            <h2 className={`text-4xl font-bold ${textPrimary} mb-8 flex items-center gap-4`}>
              <BarChart3 size={40} className="text-indigo-500" />
              Analytics Dashboard
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Tasks", value: stats.total, icon: List },
                { label: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp },
                { label: "Active", value: stats.active, icon: Clock },
                { label: "Overdue", value: stats.overdue, icon: AlertCircle }
              ].map((stat, i) => (
                <div key={i} className={`${cardBg} rounded-xl p-6 border ${borderColor}`}>
                  <stat.icon size={24} className="text-indigo-500 mb-2" />
                  <div className={`text-3xl font-black ${textPrimary} mb-1`}>{stat.value}</div>
                  <div className={`text-sm ${textSecondary}`}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className={`text-2xl font-bold ${textPrimary} mb-4`}>By Category</h3>
              <div className="space-y-3">
                {["personal", "work", "shopping", "health", "learning", "finance"].map(cat => {
                  const count = input.filter(t => t.category === cat && !t.isArchived).length;
                  const completed = input.filter(
                    t => t.category === cat && t.isCompleted && !t.isArchived
                  ).length;
                  const percentage = count > 0 ? (completed / count) * 100 : 0;

                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-1">
                        <span className={`capitalize ${textPrimary}`}>{cat}</span>
                        <span className={textSecondary}>
                          {completed}/{count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${textPrimary} mb-4 flex items-center gap-2`}>
                <Activity size={24} />
                Recent Activity
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activityLog.slice(0, 20).map(activity => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${cardBg} border ${borderColor}`}
                  >
                    <span className={textPrimary}>
                      {activity.action}
                      {activity.todoTitle && (
                        <span className="font-bold"> "{activity.todoTitle}"</span>
                      )}
                    </span>
                    <span className={`text-sm ${textSecondary}`}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SETTINGS MODAL ==================== */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowSettings(false)}
          ></div>
          <div
            className={`${cardBg} glass border ${borderColor} rounded-3xl shadow-2xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative`}
          >
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/20 transition"
            >
              <X size={28} className={textPrimary} />
            </button>

            <h2 className={`text-4xl font-bold ${textPrimary} mb-8 flex items-center gap-4`}>
              <Settings size={40} className="text-indigo-500" />
              Settings
            </h2>

            <div className="mb-8">
              <h3 className={`text-2xl font-bold ${textPrimary} mb-4`}>Profile</h3>
              
              <div className="flex justify-center mb-6">
                <label htmlFor="avatar" className="cursor-pointer relative group">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-3xl object-cover ring-4 ring-indigo-500/50 shadow-2xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-2xl ring-4 ring-indigo-500/50">
                      {tempName[0]?.toUpperCase() || userName[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Camera size={40} className="text-white" />
                  </div>
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setUserAvatar(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>

              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="Your Name"
                className={`w-full text-center text-2xl font-bold px-6 py-4 rounded-xl border ${inputBg} ${textPrimary} mb-4`}
              />

              <textarea
                value={tempBio}
                onChange={e => setTempBio(e.target.value)}
                placeholder="A little about you..."
                rows={3}
                className={`w-full px-6 py-4 rounded-xl border ${inputBg} ${textPrimary} resize-none mb-6`}
              />
            </div>

            <div className="mb-8">
              <h3 className={`text-2xl font-bold ${textPrimary} mb-4`}>Preferences</h3>
              
              <div className={`flex items-center justify-between mb-4 p-4 rounded-xl border ${borderColor}`}>
                <span className={textPrimary}>Theme</span>
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center gap-2"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setUserName(tempName.trim() || "User");
                setUserBio(tempBio.trim() || "");
                setShowSettings(false);
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:scale-105 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;