import { useState } from "react";
import Inventory from "./Inventory";
import Produce from "./Produce";
import History from "./History";
import Profile from "./Profile";

export default function Dashboard({ currentRole }) {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div id="dashboard" className="app">
      {/* Low stock alert */}
      <div id="lowStockAlert" className="low-stock-alert hidden"></div>

      <header>
        <h1>🍺 Brewery Inventory Dashboard</h1>
        <p className="subtitle">Inventory · Production · Alerts</p>
      </header>

      {/* ===== TABS WITH PROFILE ON RIGHT ===== */}
      <nav className="tabs tabs-split">
        {/* LEFT TABS */}
        <div className="tabs-left">
          {["inventory", "produce", "history"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* RIGHT PROFILE TAB */}
        <div className="tabs-right">
          <button
            className={`tab profile-tab ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
        </div>
      </nav>

      {/* ===== TAB CONTENT ===== */}
      {activeTab === "inventory" && <Inventory currentRole={currentRole} />}
      {activeTab === "produce" && <Produce />}
      {activeTab === "history" && <History />}
      {activeTab === "profile" && <Profile currentRole={currentRole} />}
    </div>
  );
}