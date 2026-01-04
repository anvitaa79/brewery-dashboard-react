import { useEffect, useState } from "react";

const STORAGE_CRED = "brew_credentials";

export default function Profile({ currentRole }) {
  const [credentials, setCredentials] = useState(
    JSON.parse(localStorage.getItem(STORAGE_CRED)) || {
      admin: "admin123",
      worker: "worker123",
    }
  );

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");

  /* ---- Admin reset ---- */
  const [worker, setWorker] = useState("worker");
  const [adminNewPwd, setAdminNewPwd] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_CRED, JSON.stringify(credentials));
  }, [credentials]);

  /* ================= USER PASSWORD CHANGE ================= */
  const changePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg("All fields are required.");
      return;
    }

    if (credentials[currentRole] !== currentPwd) {
      setPwdMsg("Current password is incorrect.");
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdMsg("New passwords do not match.");
      return;
    }

    setCredentials({
      ...credentials,
      [currentRole]: newPwd,
    });

    setPwdMsg("Password changed successfully.");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  /* ================= ADMIN RESET ================= */
  const resetWorkerPassword = () => {
    if (!worker || !adminNewPwd) {
      setResetMsg("Select worker and enter new password.");
      return;
    }

    setCredentials({
      ...credentials,
      [worker]: adminNewPwd,
    });

    setResetMsg(`Password for ${worker} reset successfully.`);
    setAdminNewPwd("");
  };

  return (
    <section className="tab-panel active">

      {/* ===== PROFILE HEADER ROW ===== */}
      <div className="profile-top-row">
        <div className="profile-user">
          Logged in as:{" "}
          <span className="username-badge">{currentRole}</span>
        </div>

        <button
          className="animated-btn logout-btn small"
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              window.location.reload();
            }
          }}
        >
          Logout
        </button>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      <div className="profile-card">
        <h3>Change Password</h3>

        <label>
          Current Password
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </label>

        <label>
          Confirm New Password
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </label>

        <button className="animated-btn" onClick={changePassword}>
          Change Password
        </button>

        <p>{pwdMsg}</p>
      </div>

      {/* ================= ADMIN RESET ================= */}
      {currentRole === "admin" && (
        <div className="profile-card admin-reset">
          <h3>Admin: Reset Worker Password</h3>

          <label>
            Select Worker
            <select
              value={worker}
              onChange={(e) => setWorker(e.target.value)}
            >
              {Object.keys(credentials)
                .filter((u) => u !== "admin")
                .map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
            </select>
          </label>

          <label>
            New Password
            <input
              type="password"
              value={adminNewPwd}
              onChange={(e) => setAdminNewPwd(e.target.value)}
            />
          </label>

          <button
            className="animated-btn reset-btn"
            onClick={resetWorkerPassword}
          >
            Reset Password
          </button>

          <p>{resetMsg}</p>
        </div>
      )}

    </section>
  );
}
