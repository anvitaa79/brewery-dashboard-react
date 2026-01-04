import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./style.css";

export default function App() {
  const [currentRole, setCurrentRole] = useState(null);

  return (
    <>
      {!currentRole ? (
        <Login onLogin={setCurrentRole} />
      ) : (
        <Dashboard currentRole={currentRole} />
      )}
    </>
  );
}
