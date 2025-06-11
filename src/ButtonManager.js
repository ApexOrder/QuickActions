import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function ButtonManager() {
  const [buttons, setButtons] = useState([]);
  const [newButton, setNewButton] = useState({ title: "", type: "url", value: "" });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "quickactions"), snapshot => {
      setButtons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const addButton = async () => {
    if (!newButton.title || !newButton.value) return;
    await addDoc(collection(db, "quickactions"), newButton);
    setNewButton({ title: "", type: "url", value: "" });
  };

  const runAction = (btn) => {
    if (btn.type === "url") {
      window.open(btn.value, "_blank");
    } else if (btn.type === "webhook") {
      fetch(btn.value, { method: "POST" });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QuickActions</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Title"
          value={newButton.title}
          onChange={e => setNewButton({ ...newButton, title: e.target.value })}
        />
        <select
          value={newButton.type}
          onChange={e => setNewButton({ ...newButton, type: e.target.value })}
        >
          <option value="url">Open URL</option>
          <option value="webhook">Trigger Webhook</option>
        </select>
        <input
          placeholder="Value (URL/Webhook)"
          value={newButton.value}
          onChange={e => setNewButton({ ...newButton, value: e.target.value })}
        />
        <button onClick={addButton}>Add</button>
      </div>
      <ul>
        {buttons.map(btn => (
          <li key={btn.id}>
            <button onClick={() => runAction(btn)}>{btn.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ButtonManager;
