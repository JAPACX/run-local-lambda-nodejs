import "dotenv/config";
import express from "express";
import {handler} from "./src/index.mjs";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
    try {
        const response = await handler(event, {logStreamName: 'test'});

        res.status(200).send(response);
    } catch (err) {
        console.error("Error executing Lambda without an event:", err);
        res.status(500).send("Error processing request without event");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const event = {
    Records: [{
        eventVersion: '2.1',
        eventSource: 'aws:s3',
        awsRegion: 'us-east-1',
        eventTime: '2024-06-05T22:09:02.063Z',
        eventName: 'ObjectCreated:Put',
        userIdentity: [Object],
        requestParameters: [Object],
        responseElements: [Object],
        s3: {
            s3SchemaVersion: '1.0',
            configurationId: '856fff92-b478-4e50-8572-e68b63ec7064',
            bucket: {
                name: 'mastershop-notification-ses',
                ownerIdentity: { principalId: 'A2K5XNS0LU5I23' },
                arn: 'arn:aws:s3:::mastershop-notification-ses'
            },
            object: {
                key: 'mailsFromCarriers/tcc/k4dshbq6g9d6agidut2r2dgu57469spdm38k6v81',
                size: 4642,
                eTag: 'd2cb31591b7e2b0721ace54d35dd2d14',
                sequencer: '00666C90C8C095B284'
            }
        }
    }]
}


