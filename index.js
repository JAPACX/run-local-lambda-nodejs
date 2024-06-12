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
            configurationId: 'd34944fd-cf50-4f2f-8429-5672c3fa8a78',
            bucket: {
                name: 'mastershop-notification-ses',
                ownerIdentity: {principalId: 'A2K5XNS0LU5I23'},
                arn: 'arn:aws:s3:::mastershop-notification-ses'
            },
            object: {
                key: 'mailsFromCarriers/tcc/m19dj1tg7jtu1rdciubhvp8qihqtim5t8jn7ogg1',
                size: 19014531,
                eTag: '65334eb6df4b28f89d132fc65d4d283e',
                sequencer: '00666A07EEBC0284D5'
            }
        }
    }]
}


