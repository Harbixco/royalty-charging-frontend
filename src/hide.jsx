import React from "react";

export default function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>⚠️</div>

        <h1 style={styles.title}>Page Currently Unavailable</h1>

        <p style={styles.description}>
          This page is currently not available. Upgrade your database memory by paying
          $15 to continue.
        </p>

        <p style={styles.footer}>Upgrade required to access this page.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px 30px",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  icon: {
    fontSize: "42px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "16px",
  },
  description: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#6b7280",
    marginBottom: "28px",
  },
  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    marginTop: "22px",
    fontSize: "12px",
    color: "#9ca3af",
  },
};