const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { db } = require("./config/db");

const app = express();
dotenv.config();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    '<h1 style="text-align:center; color: red">SQL_Project server is Live</h1>'
  );
});

// get single table data
app.get("/table/:id", (req, res) => {
  const { id } = req.params;
  const sq = `describe ${id};SELECT * FROM ${id};`;
  db.query(sq, (err, data) => {
    if (err) return res.json(err);
    return res.json({
      columns: [...data[0]?.map((e) => e)],
      data: data[1],
    });
  });
});

// get all tables name
app.get("/alltables", (req, res) => {
  db.query("show tables", (err, _data) => {
    if (err) return res.json(err);
    return res.json(_data.map((item) => Object.values(item)).flat());
  });
});

// create new table
app.post("/createtable/:name", (req, res) => {
  const { name } = req.params;
  const attr = req.body;
  if (attr.length == 0) throw new Error("Not valid");
  const innerString = [];
  let sql_q = `CREATE TABLE ${name}(`;
  attr.map((item) => {
    const tmp = item.field_name + " " + item.field_type;
    innerString.push(tmp);
  });
  sql_q = sql_q + innerString.join(",") + ")";

  db.query(sql_q, (err, _data) => {
    if (err) return res.json(err);
    return res.json(_data);
  });
});

// insert new data in the table
app.post("/table/insert/:id", (req, res) => {
  const { id } = req.params;
  const attr = req.body;
  if (attr.length == 0) throw new Error("Not valid");
  let sql_q = `INSERT INTO ${id}(`;
  sql_q = sql_q + Object.keys(attr).join(",") + ") values(";
  sql_q =
    sql_q +
    Object.values(attr)
      .map((e) => (e === "default" ? e : `'${e}'`))
      .join(",") +
    ")";
  db.query(sql_q, (err, _data) => {
    if (err) return res.json(err);
    return res.json(_data);
  });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
