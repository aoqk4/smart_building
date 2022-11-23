import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [co2, setCo2] = useState([]);
  async function getCo2() {
    const a = axios
      .get("http://localhost:5000/api/co2")
      .then((res) => setCo2(res.data.data));
  }
  useEffect(() => {
    getCo2();
  }, []);

  return (
    <div>
      {co2
        ? co2.map((ele, idx) => {
            return (
              <div key={idx}>
                <h1>{ele.room}</h1>
                <span>{ele.co2}</span>
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default App;
