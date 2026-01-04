import { useEffect, useState } from "react";

/* ================= SAME STORAGE KEY ================= */
const STORAGE_HIS = "brew_history_v3";
const STORAGE_INV = "brew_inventory_v3";

/* ================= COMPONENT ================= */
export default function History() {
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem(STORAGE_HIS)) || []
  );

  const [inventory] = useState(
    JSON.parse(localStorage.getItem(STORAGE_INV)) || {}
  );

  /* ================= EFFECT ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(JSON.parse(localStorage.getItem(STORAGE_HIS)) || []);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  /* ================= RENDER ================= */
  return (
    <section className="tab-panel active">
      <h2>Transaction History</h2>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Brand</th>
            <th>Used Ingredients</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", opacity: 0.7 }}>
                No production history available
              </td>
            </tr>
          )}

          {history.map((entry, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{entry.date}</td>
              <td>{entry.brand}</td>
              <td>
                {Object.entries(entry.used)
                  .map(
                    ([k, v]) =>
                      `${k}: ${v} ${
                        inventory[k]?.unit ? inventory[k].unit : ""
                      }`
                  )
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
