import { useEffect, useState } from "react";

/* ================= SAME DATA ================= */
const BRANDS = {
  Lager: { rice: 50, sugar: 10, water: 100, hops: 5, malt: 20, enzymes: 2 },
  IPA: { rice: 30, sugar: 15, water: 120, hops: 15, malt: 30, enzymes: 3 },
  Stout: { rice: 40, sugar: 20, water: 110, hops: 10, malt: 40, enzymes: 4 }
};

const RECIPE_UNITS = {
  rice: "kg",
  sugar: "kg",
  water: "L",
  hops: "%",
  malt: "kg",
  enzymes: "g"
};

const STORAGE_INV = "brew_inventory_v3";
const STORAGE_HIS = "brew_history_v3";

/* ================= COMPONENT ================= */
export default function Produce() {
  const [inventory, setInventory] = useState(
    JSON.parse(localStorage.getItem(STORAGE_INV)) || {}
  );

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem(STORAGE_HIS)) || []
  );

  const [selectedBrand, setSelectedBrand] = useState("");
  const [message, setMessage] = useState("");

  /* ================= EFFECTS ================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_INV, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_HIS, JSON.stringify(history));
  }, [history]);

  /* ================= ACTIONS ================= */

  /* ---- Produce batch ---- */
  const produceBatch = () => {
    if (!selectedBrand) return;

    const recipe = BRANDS[selectedBrand];

    /* VALIDATION (1:1) */
    for (let key in recipe) {
      if (!inventory[key] || inventory[key].qty < recipe[key]) {
        setMessage(`Not enough ${key}`);
        return;
      }
    }

    /* DEDUCT INVENTORY */
    const updatedInventory = { ...inventory };
    for (let key in recipe) {
      updatedInventory[key].qty -= recipe[key];
    }

    /* ADD HISTORY */
    const newEntry = {
      date: new Date().toLocaleString(),
      brand: selectedBrand,
      used: recipe
    };

    setInventory(updatedInventory);
    setHistory([newEntry, ...history]);

    setMessage("Batch produced successfully");
  };

  /* ================= RENDER ================= */
  return (
    <section className="tab-panel active">
      <h2>Produce Batch</h2>

      {/* BRAND SELECT */}
      <select
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          setMessage("");
        }}
      >
        <option value="">-- Select Brand --</option>
        {Object.keys(BRANDS).map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* RECIPE BOX */}
      {selectedBrand && (
        <div id="recipeBox">
          <h3>Ingredients Required</h3>

          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Required</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(BRANDS[selectedBrand]).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                  <td>{RECIPE_UNITS[k] || inventory[k]?.unit || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={produceBatch}>Produce Batch</button>
          <p
            id="message"
            style={{
              color:
                message === "Batch produced successfully"
                  ? "lightgreen"
                  : "red",
            }}
          >
            {message}
          </p>
        </div>
      )}
    </section>
  );
}
