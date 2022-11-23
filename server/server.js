const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./database");
const connection = mysql.createConnection(dbconfig);
const app = express();

app.get("/api/co2", (req, res) => {
  // res.send("hi");
  connection.query(
    `SELECT co2, room FROM building_sensor GROUP BY room ORDER BY uTime DESC`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/humi", (req, res) => {
  // res.send("hi");
  connection.query(
    `SELECT humi, room FROM building_sensor GROUP BY room ORDER BY uTime DESC`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/light", (req, res) => {
  // res.send("hi");
  connection.query(
    `SELECT light, room FROM building_sensor GROUP BY room ORDER BY uTime DESC`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/temper", (req, res) => {
  // res.send("hi");
  connection.query(
    `SELECT temper, room FROM building_sensor GROUP BY room ORDER BY uTime DESC`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});

const port = 5000;

app.listen(port, () => console.log(`${port}`));
