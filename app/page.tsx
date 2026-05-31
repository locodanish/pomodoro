"use client";

import { useState, useEffect } from "react";

type Tab = "focus" | "tasks" | "stats" | "settings";
type SessionType = "focus" | "break";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("focus");

  // Pomodoro state
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [seconds, setSeconds] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Stats state
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((s) => s - 1);
        setTotalFocusTime((t) => t + 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      // Session completed
      if (sessionType === "focus") {
        setSessionsCompleted((c) => c + 1);
        setSessionType("break");
        setSeconds(breakMinutes * 60);
      } else {
        setSessionType("focus");
        setSeconds(focusMinutes * 60);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, seconds, sessionType, focusMinutes, breakMinutes]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTotalTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionType("focus");
    setSeconds(focusMinutes * 60);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const progressPercent =
    ((focusMinutes * 60 - seconds) / (focusMinutes * 60)) * 100;

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 lg:min-h-[70vh]">
      {/* Sidebar */}
      <aside className="lg:w-56 bg-white/70 backdrop-blur rounded-2xl p-4 shadow-md border border-white/40">
        <h2 className="text-lg font-bold text-purple-600 mb-4">🍅 Menu</h2>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          <button
            onClick={() => setActiveTab("focus")}
            className={`text-left px-3 py-2 rounded-lg transition whitespace-nowrap lg:whitespace-normal ${
              activeTab === "focus"
                ? "bg-purple-200 text-purple-700"
                : "hover:bg-purple-100 text-gray-600"
            }`}
          >
            ⏱ Focus
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`text-left px-3 py-2 rounded-lg transition whitespace-nowrap lg:whitespace-normal ${
              activeTab === "tasks"
                ? "bg-purple-200 text-purple-700"
                : "hover:bg-purple-100 text-gray-600"
            }`}
          >
            📝 Tasks
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`text-left px-3 py-2 rounded-lg transition whitespace-nowrap lg:whitespace-normal ${
              activeTab === "stats"
                ? "bg-purple-200 text-purple-700"
                : "hover:bg-purple-100 text-gray-600"
            }`}
          >
            📊 Stats
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`text-left px-3 py-2 rounded-lg transition whitespace-nowrap lg:whitespace-normal ${
              activeTab === "settings"
                ? "bg-purple-200 text-purple-700"
                : "hover:bg-purple-100 text-gray-600"
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md border border-white/40">
        {activeTab === "focus" && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Session Type Badge */}
            <div className="flex gap-2">
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  sessionType === "focus"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {sessionType === "focus" ? "🍅 Focus Time" : "☘️ Break Time"}
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
                Session {sessionsCompleted + 1}
              </span>
            </div>

            {/* Timer Display with Progress Ring */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={sessionType === "focus" ? "#ec4899" : "#22c55e"}
                  strokeWidth="8"
                  strokeDasharray={`${(progressPercent / 100) * 565.48} 565.48`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl lg:text-6xl font-bold text-purple-600">
                    {formatTime(seconds)}
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500 mt-2">
                    {sessionType === "focus" ? "Focus" : "Break"}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => setIsRunning(true)}
                disabled={isRunning}
                className="px-6 py-3 rounded-full bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold shadow-md transition"
              >
                ▶ Start
              </button>

              <button
                onClick={() => setIsRunning(false)}
                disabled={!isRunning}
                className="px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white font-semibold shadow-md transition"
              >
                ⏸ Pause
              </button>

              <button
                onClick={resetTimer}
                className="px-6 py-3 rounded-full bg-pink-400 hover:bg-pink-500 text-white font-semibold shadow-md transition"
              >
                🔄 Reset
              </button>
            </div>

            {/* Motivational text */}
            <p className="text-sm lg:text-base text-gray-600 text-center">
              {sessionType === "focus"
                ? "💪 You can do it! Stay focused..."
                : "🌟 Great work! Take a quick break..."}
            </p>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="py-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              📝 Tasks
            </h2>

            {/* Add Task Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={addTask}
                className="px-6 py-3 rounded-lg bg-purple-400 hover:bg-purple-500 text-white font-semibold shadow-md transition"
              >
                ➕ Add
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No tasks yet. Add one to get started! ✨
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded cursor-pointer accent-purple-400"
                    />
                    <span
                      className={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Task Progress */}
            {tasks.length > 0 && (
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-700">
                    Progress
                  </span>
                  <span className="text-sm text-purple-600">
                    {tasks.filter((t) => t.completed).length}/{tasks.length}
                  </span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="py-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              📊 Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sessions Completed */}
              <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg border border-pink-200">
                <div className="text-3xl font-bold text-pink-600">
                  {sessionsCompleted}
                </div>
                <p className="text-gray-600 mt-2">Sessions Completed</p>
                <p className="text-xs text-gray-500 mt-1">🍅 Keep it up!</p>
              </div>

              {/* Total Focus Time */}
              <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">
                  {formatTotalTime(totalFocusTime)}
                </div>
                <p className="text-gray-600 mt-2">Total Focus Time</p>
                <p className="text-xs text-gray-500 mt-1">
                  ⏱️ Amazing dedication!
                </p>
              </div>

              {/* Tasks Completed */}
              <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {tasks.filter((t) => t.completed).length}
                </div>
                <p className="text-gray-600 mt-2">Tasks Completed</p>
                <p className="text-xs text-gray-500 mt-1">
                  ✅ Stay productive!
                </p>
              </div>

              {/* Average Session */}
              <div className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">
                  {focusMinutes}m
                </div>
                <p className="text-gray-600 mt-2">Session Duration</p>
                <p className="text-xs text-gray-500 mt-1">⚡ Current setting</p>
              </div>
            </div>

            {/* Daily reminder */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 font-semibold">💡 Productivity Tip</p>
              <p className="text-blue-600 text-sm mt-2">
                You've completed <strong>{sessionsCompleted}</strong> sessions!
                Keep maintaining this routine to build a productive habit. 🌟
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="py-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              ⚙️ Settings
            </h2>

            <div className="space-y-6">
              {/* Focus Duration */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <label className="block text-gray-700 font-semibold mb-3">
                  🍅 Focus Session Duration
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={focusMinutes}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setFocusMinutes(newVal);
                      if (sessionType === "focus" && !isRunning) {
                        setSeconds(newVal * 60);
                      }
                    }}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-purple-600 w-16">
                    {focusMinutes}m
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Adjust your focus session duration
                </p>
              </div>

              {/* Break Duration */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <label className="block text-gray-700 font-semibold mb-3">
                  ☘️ Break Duration
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setBreakMinutes(newVal);
                      if (sessionType === "break" && !isRunning) {
                        setSeconds(newVal * 60);
                      }
                    }}
                    className="flex-1 cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-green-600 w-16">
                    {breakMinutes}m
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  How long should your breaks be?
                </p>
              </div>

              {/* Reset Stats */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <label className="block text-gray-700 font-semibold mb-3">
                  🔄 Reset Statistics
                </label>
                <button
                  onClick={() => {
                    setSessionsCompleted(0);
                    setTotalFocusTime(0);
                    setTasks([]);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition"
                >
                  Reset All Data
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Clear all statistics and tasks
                </p>
              </div>

              {/* Info */}
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-700 font-semibold">
                  ✨ About Pomodoro
                </p>
                <p className="text-purple-600 text-sm mt-2">
                  The Pomodoro Technique is a time management method that uses
                  timed intervals to improve focus and productivity. Work in
                  focused bursts, then take breaks to recharge!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
