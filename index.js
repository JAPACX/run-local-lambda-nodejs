const express = require("express");
const fs = require("fs");
const { handler } = require("./lambda");
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
  const eventName = req.params.eventName;
  const filePath = `./events/${eventName}.json`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading the event file: ${err.message}`);
      return res.status(500).send("Event not found or error reading the file");
    }

    const event = JSON.parse(data);
    handler(event)
      .then((response) => {
        res.json(JSON.parse(response.body));
      })
      .catch((err) => {
        console.error("Error executing Lambda with event:", err);
        res.status(500).send("Error processing the event from the file");
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
