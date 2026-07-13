import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";

const detectBrowserAndDevice = (userAgent) => {
  let browser = "Unknown";
  let device = "Unknown";

  // Detect browser
  if (/Edg\//.test(userAgent)) browser = "Edge";
  else if (/OPR\//.test(userAgent)) browser = "Opera";
  else if (/Chrome\//.test(userAgent)) browser = "Chrome";
  else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent))
    browser = "Safari";
  else if (/Firefox\//.test(userAgent)) browser = "Firefox";
  else if (/MSIE|Trident\//.test(userAgent)) browser = "Internet Explorer";

  // Detect device
  if (/Android/.test(userAgent)) device = "Android";
  else if (/iPhone/.test(userAgent)) device = "iPhone";
  else if (/iPad/.test(userAgent)) device = "iPad";
  else if (/Windows NT/.test(userAgent)) device = "Windows";
  else if (/Macintosh/.test(userAgent)) device = "Mac";
  else if (/Linux/.test(userAgent)) device = "Linux";

  return `${browser} (${device})`;
};

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [settings, setSettings] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/visitors/botuser`)
      .then((res) => res.json())
      .then((data) => {

        const processed = data.slice(0, 100).map((v) => ({
          ip: v.ip,
          time: v.timestamp ? new Date(v.timestamp).toLocaleString() : "N/A",
          browser: v.userAgent
            ? detectBrowserAndDevice(v.userAgent)
            : "Unknown",
          page: v.path || "/",
          isBot: v.isBot || false,
          country: v.country || "🌐 Unknown",
        }));

        setVisitors(processed);
        setTodayVisitors(processed.length);
        setTotalVisitors((prev) => prev + processed.length);
      });

    fetch(`${apiUrl}/admin/blocked`)
      .then((res) => res.json())
      .then(setBlockedUsers);

    fetch(`${apiUrl}/api/settings`)
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect username or password");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    fetch(`${apiUrl}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  const blockUser = (ip) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      const date = new Date().toISOString().split("T")[0];
      const blocked = { ip, date, reason: "Manually blocked" };
      fetch(`${apiUrl}/admin/blocked`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blocked),
      }).then(() => {
        setBlockedUsers((prev) => [...prev, blocked]);
        alert("User has been blocked.");
      });
    }
  };

  const unblockUser = (ip) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      fetch(`${apiUrl}/admin/blocked/${ip}`, {
        method: "DELETE",
      }).then(() => {
        setBlockedUsers((prev) => prev.filter((user) => user.ip !== ip));
        alert("User has been unblocked.");
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>🔐 Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username:</label>
              <input
                type="text"
                name="username"
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password:</label>
              <input
                type="password"
                name="password"
                className={styles.formInput}
                required
              />
            </div>
            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div className={styles.navTabs}>
        {["overview", "visitors", "results", "blocked", "settings"].map(
          (tab) => (
            <button
              key={tab}
              className={`${styles.navTab} ${
                activeTab === tab ? styles.active : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {activeTab === "overview" && (
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{todayVisitors}</div>
            <div className={styles.statLabel}>Visitors Today</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {totalVisitors.toLocaleString()}
            </div>
            <div className={styles.statLabel}>Total Visitors</div>
          </div>
        </div>
      )}

      {activeTab === "visitors" && (
        <div className={styles.tableSection}>
          <h3 className={styles.sectionTitle}>Last 10 Visitors</h3>
          <button
            className={styles.clearBtn}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete ALL visitors?")
              ) {
                fetch(`${apiUrl}/api/visitors/delete-all`, {
                  method: "DELETE",
                })
                  .then((res) => res.json())
                  .then(() => {
                    setVisitors([]);
                    setTodayVisitors(0);
                    alert("All visitors deleted.");
                  });
              }
            }}
          >
            🗑️ Delete All Visitors
          </button>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>IP</th>
                <th>Browser</th>
                <th>Page</th>
                <th>Bot</th>
                <th>Country</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={i}>
                  <td>{v.time}</td>
                  <td>{v.ip}</td>
                  <td>{v.browser}</td>
                  <td>{v.page}</td>
                  <td>{v.isBot ? "✔️" : "❌"}</td>
                  <td>{v.country}</td>
                  <td>
                    <button
                      className={styles.blockBtn}
                      onClick={() => blockUser(v.ip)}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "results" && (
        <div className={styles.tableSection}>
          <h3 className={styles.sectionTitle}>Results Table</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visitors</th>
                <th>Page Views</th>
                <th>Bounce Rate</th>
                <th>Session Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-07-10</td>
                <td>247</td>
                <td>892</td>
                <td>32%</td>
                <td>3:45</td>
              </tr>
              <tr>
                <td>2024-07-09</td>
                <td>298</td>
                <td>1045</td>
                <td>28%</td>
                <td>4:12</td>
              </tr>
              <tr>
                <td>2024-07-08</td>
                <td>342</td>
                <td>1234</td>
                <td>25%</td>
                <td>4:38</td>
              </tr>
              <tr>
                <td>2024-07-07</td>
                <td>289</td>
                <td>967</td>
                <td>35%</td>
                <td>3:22</td>
              </tr>
              <tr>
                <td>2024-07-06</td>
                <td>275</td>
                <td>823</td>
                <td>38%</td>
                <td>3:05</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "blocked" && (
        <div className={styles.tableSection}>
          <h3 className={styles.sectionTitle}>Blocked Users</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>IP</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blockedUsers.map((user, i) => (
                <tr key={i}>
                  <td>{user.ip}</td>
                  <td>{user.date}</td>
                  <td>{user.reason}</td>
                  <td>
                    <button
                      className={styles.unblockBtn}
                      onClick={() => unblockUser(user.ip)}
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "settings" && (
        <div className={styles.tableSection}>
          <h3 className={styles.sectionTitle}>Settings</h3>
          <div className={styles.settingsForm}>
            {Object.entries(settings).map(([key, value]) => (
              <div className={styles.settingsGroup} key={key}>
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <div
                  className={`${styles.toggleSwitch} ${
                    value ? styles.active : ""
                  }`}
                  onClick={() => toggleSetting(key)}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
