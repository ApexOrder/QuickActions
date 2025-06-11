import React, { useEffect, useState } from "react";
import { app, authentication } from "@microsoft/teams-js";

function App() {
  const [userName, setUserName] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    app.initialize().then(() => {
      authentication.getAuthToken().then((token) => {
        setUserName("Signed in to Teams");
      }).catch(err => {
        setError("Not signed in or permission denied.");
      });
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>QuickActions</h1>
      <p>{error ? error : userName}</p>
    </div>
  );
}

export default App;
