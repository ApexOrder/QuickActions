import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { app } from "@microsoft/teams-js";

function ButtonManager() {
  const [buttons, setButtons] = useState([]);
  const [newButton, setNewButton] = useState({ title: "", type: "url", value: "" });
  const [tenantId, setTenantId] = useState(null);

  // Initialize Teams SDK and get tenant ID
  useEffect(() => {
    app.initialize().then(() => {
      app.getContext().then(context => {
        setTenantId(context.user?.tenant?.id || null);
      });
    });
  }, []);

  // Fetch buttons only for this tenant
  useEffect(() => {
    if (!tenantId) return;

    const q = query(collection(db, "quickactions"), where("tenantId", "==", tenantId));
    const unsub = onSnapshot(q, snapshot => {
      setButtons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [tenantId]);

  const addButton = async () => {
    if (!newButton.title || !newButton.value || !tenantId) return;
    await addDoc(collection(db, "quickactions"), {
      ...newButton,
      tenantId
    });
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
      {tenantId ? (
        <>
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
        </>
      ) : (
        <p>Loading tenant context from Teams…</p>
      )}
    </div>
  );
}

export default ButtonManager;