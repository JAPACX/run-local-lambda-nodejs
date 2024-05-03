import "dotenv/config";
import express from "express";
import {handler} from "./src/index.mjs";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
    try {
        const response = await handler(event, {});
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${response.pdfFileName}"`);
        res.send(Buffer.from(response.pdfBytes));
    } catch (err) {
        console.error("Error executing Lambda without an event:", err);
        res.status(500).send("Error processing request without event");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const event = {
    "version": "0",
    "id": "3ebb1a3b-c89e-262d-d3e8-f3384c9ab66e",
    "detail-type": "MANIFEST-DOWNLOAD",
    "source": "MASTERSHOP-DOCUMENTS",
    "account": "045891372648",
    "time": "2024-04-30T23:47:04Z",
    "region": "us-east-1",
    "resources": [],
    "detail": {
        "userId": 66011,
        "ordersIds": [
            "1739",
            "1726",
            "2404",
            "2371",
            "2262"
        ],
        "typeManifest": "normal"
    }
}


