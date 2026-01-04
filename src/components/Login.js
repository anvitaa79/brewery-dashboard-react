import { useEffect } from "react";

export default function Login({ onLogin }) {

  useEffect(() => {
    // Apply background image safely using inline style
    document.body.style.backgroundImage =
      "url(" + process.env.PUBLIC_URL + "/brewery-bg.jpg)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      // Cleanup after login
      document.body.style.backgroundImage = "";
    };
  }, []);

  const login = () => {
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();

    const creds = JSON.parse(localStorage.getItem("brew_credentials")) || {
      admin: "admin123",
      worker: "worker123",
    };

    if (creds[u] === p) {
      // Remove background before entering dashboard
      document.body.style.backgroundImage = "";
      onLogin(u);
    } else {
      document.getElementById("loginMsg").textContent = "Invalid login";
    }
  };

  return (
    <div className="login-screen">
      <h2>Login</h2>
      <input id="username" placeholder="Username" />
      <input id="password" type="password" placeholder="Password" />
      <button onClick={login}>Login</button>
      <p id="loginMsg" className="error-msg"></p>
    </div>
  );
}
