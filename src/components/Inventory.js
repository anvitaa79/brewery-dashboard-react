import { useEffect, useState } from "react";

/* ================= CONSTANTS (UNCHANGED) ================= */
const DEFAULT_INVENTORY = {
  rice: { qty: 1000, unit: "kg" },
  sugar: { qty: 500, unit: "kg" },
  water: { qty: 2000, unit: "L" },
  hops: { qty: 200, unit: "%" },
  malt: { qty: 300, unit: "kg" },
  enzymes: { qty: 100, unit: "g" }
};

const STORAGE_INV = "brew_inventory_v3";
const STORAGE_HIS = "brew_history_v3";

/* ================= COMPONENT ================= */
export default function Inventory({ currentRole }) {
  const [inventory, setInventory] = useState(
    JSON.parse(localStorage.getItem(STORAGE_INV)) ||
      structuredClone(DEFAULT_INVENTORY)
  );

  /* ---- Add form ---- */
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newUnit, setNewUnit] = useState("");

  /* ---- Edit state ---- */
  const [editingKey, setEditingKey] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editUnit, setEditUnit] = useState("");

  /* ---- Reset msg ---- */
  const [resetMsg, setResetMsg] = useState("");

  /* ================= EFFECTS ================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_INV, JSON.stringify(inventory));
    updateLowStockAlert();
  }, [inventory]);

  /* ================= HELPERS ================= */
  const isLowStock = (qty, unit) => qty <= (unit === "g" ? 20 : 50);

  const updateLowStockAlert = () => {
    const lowItems = Object.entries(inventory)
      .filter(([_, v]) => isLowStock(v.qty, v.unit))
      .map(([k]) => k);

    const alert = document.getElementById("lowStockAlert");
    if (!alert) return;

    if (lowItems.length) {
      alert.textContent = "⚠ Low stock: " + lowItems.join(", ");
      alert.classList.remove("hidden");
    } else {
      alert.classList.add("hidden");
    }
  };

  /* ================= ACTIONS ================= */

  /* ---- Edit / Save ---- */
  const toggleEdit = (key) => {
    // START editing
    if (editingKey !== key) {
      setEditingKey(key);
      setEditQty(inventory[key].qty);
      setEditUnit(inventory[key].unit);
      return;
    }

    // SAVE
    setInventory({
      ...inventory,
      [key]: {
        qty: Number(editQty),
        unit: editUnit
      }
    });

    setEditingKey(null);
  };

  /* ---- Delete ---- */
  const deleteItem = (key) => {
    if (!window.confirm("Delete ingredient?")) return;
    const updated = { ...inventory };
    delete updated[key];
    setInventory(updated);
  };

  /* ---- Add ---- */
  const addItem = () => {
    if (!newName || !newQty || !newUnit) {
      alert("Fill all fields");
      return;
    }

    const key = newName.trim().toLowerCase();
    setInventory({
      ...inventory,
      [key]: { qty: Number(newQty), unit: newUnit }
    });

    setNewName("");
    setNewQty("");
    setNewUnit("");
  };

  /* ---- Reset All ---- */
  const resetAll = () => {
    if (currentRole !== "admin") {
      setResetMsg("Only admin can reset everything!");
      return;
    }

    if (!window.confirm("Reset ALL inventory and history?")) return;

    localStorage.removeItem(STORAGE_HIS);
    setInventory(structuredClone(DEFAULT_INVENTORY));
    setResetMsg("Reset All Inventory and History successfully!");
  };

  /* ================= RENDER ================= */
  return (
    <section className="tab-panel active">
      <h2>Inventory Management</h2>

      {/* ADD FORM */}
      {currentRole === "admin" && (
        <div className="add-form">
          <input
            placeholder="Ingredient name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
          />
          <input
            placeholder="Unit (kg, L, %, g...)"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
          />
          <button onClick={addItem}>Add</button>
        </div>
      )}

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Stock Alert</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(inventory).map(([key, obj]) => (
            <tr
              key={key}
              className={isLowStock(obj.qty, obj.unit) ? "low-stock" : ""}
            >
              <td>{key}</td>

              <td>
                <input
                  type="number"
                  value={editingKey === key ? editQty : obj.qty}
                  disabled={editingKey !== key}
                  onChange={(e) => setEditQty(e.target.value)}
                />
              </td>

              <td>
                <input
                  value={editingKey === key ? editUnit : obj.unit}
                  disabled={editingKey !== key}
                  onChange={(e) => setEditUnit(e.target.value)}
                />
              </td>

              <td>{isLowStock(obj.qty, obj.unit) ? "Low" : "OK"}</td>

              <td>
                {currentRole === "admin" && (
                  <>
                    <button
                      className="action-btn"
                      onClick={() => toggleEdit(key)}
                    >
                      {editingKey === key ? "Save" : "Edit"}
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => deleteItem(key)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RESET */}
      <div className="reset-container">
        <button
          onClick={resetAll}
          className="action-btn"
          style={{ backgroundColor: "red", color: "white" }}
        >
          Reset All
        </button>
        <span id="resetAllMsg">{resetMsg}</span>
      </div>
    </section>
  );
}
