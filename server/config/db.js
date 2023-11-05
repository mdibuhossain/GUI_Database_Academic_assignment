const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mortuza_sir",
  multipleStatements: true,
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Database connect successfully");
});

module.exports = { db };
