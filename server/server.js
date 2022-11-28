const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./database");
const connection = mysql.createConnection(dbconfig);
const app = express();

app.get("/api/co2", (req, res) => {
  connection.query(
    `select co2, room, uTime from (select * from building_sensor where (room, uTime) in (select room, max(uTime) as uTime from building_sensor group by room))t order by uTime asc`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/humi", (req, res) => {
  connection.query(
    `select humi, room, uTime from (select * from building_sensor where (room, uTime) in (select room, max(uTime) as uTime from building_sensor group by room))t order by uTime asc`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/light", (req, res) => {
  connection.query(
    `select light, room, uTime from (select * from building_sensor where (room, uTime) in (select room, max(uTime) as uTime from building_sensor group by room))t order by uTime asc`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});
app.get("/api/temper", (req, res) => {
  connection.query(
    `select temper, room, uTime from (select * from building_sensor where (room, uTime) in (select room, max(uTime) as uTime from building_sensor group by room))t order by uTime asc`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});

app.get("/api/roomdata", (req, res) => {
  connection.query(
    `select * from building_sensor order by uTime desc limit 5`,
    (err, rows) => {
      res.json({
        data: rows,
      });
    }
  );
});

app.get("/api/testtest", (req, res) => {
  connection.query(`select * from co22`, (err, rows) => {
    console.log(rows);
    res.json({
      data: rows,
    });
  });
});

const port = 5000;

app.listen(port, () => console.log(`${port}`));
