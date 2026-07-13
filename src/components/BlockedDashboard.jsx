import React, { useEffect, useState } from "react";

function BlockedDashboard() {
  const [blockedIps, setBlockedIps] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/blocked`)
      .then((res) => res.json())
      .then((data) => setBlockedIps(data.blocked))
      .catch((err) => console.error("Fejl ved hentning af blokerede IP'er:", err));
  }, []);

  const handleUnblock = async (ip) => {
    try {
      const res = await     fetch(`${apiUrl}/api/unblock/${ip}`, {
        method: "POST",
      });

      if (res.ok) {
        setBlockedIps((prev) => prev.filter((item) => item !== ip));
      } else {
        console.error("Kunne ikke fjerne blokering af IP");
      }
    } catch (error) {
      console.error("Fejl:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚫 Liste over blokerede besøgende</h2>

        {blockedIps.length === 0 ? (
          <p style={styles.empty}>Ingen blokerede besøgende i øjeblikket.</p>
        ) : (
          <ul style={styles.list}>
            {blockedIps.map((ip, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.ip}>{ip}</span>
                <button onClick={() => handleUnblock(ip)} style={styles.button}>
                  🟢 Fjern blokering
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  empty: {
    color: "#777",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    border: "1px solid #ddd",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  ip: {
    fontFamily: "monospace",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default BlockedDashboard;