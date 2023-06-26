require("dotenv").config();
const fs = require("fs");
const db = require("./db");

const sql = fs.readFileSync("db/setup.sql").toString();
db.query(sql)
  .then((data) => console.log("setup complete"))
  .catch((error) => console.log(error));
