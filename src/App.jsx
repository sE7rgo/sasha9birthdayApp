import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import Chat from "./components/Chat";
import Where from "./components/Where";
import Welcome from "./components/Welcome";
const App = () => {
  const [tab, setTab] = useState(null);
  const chatRef = useRef(null);
  const whereRef = useRef(null);

  useEffect(() => {
    if (tab === "chat" && chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "where" && whereRef.current) {
      whereRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tab]);

  return (
    <div className="App">
      <div style={{ marginBottom: "10%" }}>
        <Welcome setTab={setTab} />
      </div>
      {tab === "chat" && (
        <div ref={chatRef}>
          <Chat />
        </div>
      )}
      {tab === "where" && (
        <div ref={whereRef}>
          <Where />
        </div>
      )}
    </div>
  );
};

export default App;
