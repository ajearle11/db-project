const express = require("express");
const cors = require("cors");
const api = express();
const db = require("./db/db");
// Add standard middleware
api.use(express.json());
api.use(cors());
// Api routes
api.get("/", (req, res) => res.send("The Wrongs API: track injustice."));

api.get("/wrongs", async (req, res) => {
  const data = await db.query("SELECT * FROM wrong;");
  res.send(data.rows);
});

api.get("/people", async (req, res) => {
  const data = await db.query("SELECT * FROM people;");
  res.send(data.rows);
});

api.get("/people/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await db.query("SELECT * FROM person WHERE person_id = $1", [
    id,
  ]);
  res.send(data.rows[0]);
});

api.get("/wrongs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await db.query("SELECT * FROM wrong WHERE wrong_id = $1", [id]);
  res.send(data.rows[0]);
});

api.post("/wrongs", async (req, res) => {
  const newWrong = req.body;
  const {
    perpetrator_id,
    victim_id,
    description,
    forgiven = false,
    forgotten = false,
    revenged = false,
  } = newWrong;

  const data = await db.query(
    "INSERT INTO wrong(perpetrator_id, victim_id, description, forgiven, forgotten, revenged) VALUES($1, $2, $3, $4, $5, $6)",
    [
      newWrong.perpetrator_id,
      newWrong.victim_id,
      newWrong.description,
      forgiven,
      forgotten,
      revenged,
    ]
  );
  res.send(data.rows[0]);
});

api.post("/people", async (req, res) => {
  const personName = req.body.person_name;
  const data = await db.query(
    "INSERT INTO person(person_name) VALUES ($1) RETURNING *",
    [personName]
  );
  console.log(data.rows[0]);
  res.send(data.rows[0]);
});

api.delete("/wrongs/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await db.query("DELETE FROM wrong WHERE wrong_id = $1", [id]);
  res.send(data.rows);
});

api.patch("/wrongs/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const originalData = await db.query(
    "SELECT * FROM wrong WHERE wrong_id = $1",
    [id]
  );

  const newWrong = req.body;
  const {
    perpetrator_id = originalData.rows[0].perpetrator_id,
    victim_id = originalData.rows[0].victim_id,
    description = originalData.rows[0].description,
    forgiven = originalData.rows[0].forgiven,
    forgotten = originalData.rows[0].forgotten,
    revenged = originalData.rows[0].revenged,
  } = newWrong;

  const data = await db.query(
    "UPDATE wrong SET perpetrator_id = $1, victim_id = $2, description = $3, forgiven = $4, forgotten = $5, revenged = $6 WHERE wrong_id = $7",
    [perpetrator_id, victim_id, description, forgiven, forgotten, revenged, id]
  );
  res.send(data.rows[0]);
});

api.delete("/people/:id", async (req, res) => {
  const id = req.params.id;

  const person = await db.query("DELETE FROM person WHERE person_id = $1", [
    id,
  ]);

  res.send("Deleted");
});

api.get("/stats", async (req, res) => {
  const data = await db.query(
    "SELECT description, forgiven, forgotten, revenged FROM wrong"
  );

  res.send(data.rows);
});

api.get("/stats/people", async (req, res) => {
  const data = await db.query(
    "SELECT person.person_name, description, forgiven, forgotten, revenged FROM person JOIN wrong ON person.person_id = wrong.perpetrator_id"
  );

  res.send(data.rows);
});

api.get("/stats/:id", async (req, res) => {
  const id = req.params.id;

  const data = await db.query(
    "SELECT person.person_name, wrong.description, wrong.forgiven, wrong.forgotten, wrong.revenged FROM person JOIN wrong ON (person.person_id = wrong.perpetrator_id) WHERE person.person_id = $1",
    [id]
  );

  res.send(data.rows[0]);
});
module.exports = api;
