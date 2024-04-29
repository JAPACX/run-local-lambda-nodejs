import "dotenv/config";
import express from "express";
import { handler } from "./src/index.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  handler({}, {})
    .then((response) => {
      res.json(JSON.parse(response.body));
    })
    .catch((err) => {
      console.error("Error executing Lambda without an event:", err);
      res.status(500).send("Error processing request without event");
    });
});


