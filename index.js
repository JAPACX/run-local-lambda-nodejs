import "dotenv/config";
import express from "express";
import { handler } from "./src/index.mjs";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const response = await handler({}, {});
    res.json(JSON.parse(response.body));
  } catch (err) {
    console.error("Error executing Lambda without an event:", err);
    res.status(500).send("Error processing request without event");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


