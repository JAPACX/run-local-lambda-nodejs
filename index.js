import express from "express";
import { promises as fs } from "fs";
import { handler } from "./src/index.js";

const app = express();
const PORT = 3000;

app.get("/invoke", (req, res) => {
  handler({})
    .then((response) => {
      res.json(JSON.parse(response.body));
    })
    .catch((err) => {
      console.error("Error executing Lambda without an event:", err);
      res.status(500).send("Error processing request without event");
    });
});

app.get("/invoke/:eventName", (req, res) => {
  const { eventName } = req.params;
  const filePath = `./events/${eventName}.json`;

  fs.readFile(filePath, "utf8")
    .then((data) => {
      const event = JSON.parse(data);
      return handler(event);
    })
    .then((response) => {
      res.json(JSON.parse(response.body));
    })
    .catch((err) => {
      console.error(
        `Error reading the event file or executing Lambda with event: ${err.message}`
      );
      res.status(500).send("Event not found or error processing the event");
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
