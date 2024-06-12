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
                ownerIdentity: { principalId: 'A2K5XNS0LU5I23' },
                arn: 'arn:aws:s3:::mastershop-notification-ses'
            },
            object: {
                key: 'mailsFromCarriers/tcc/uvd68jufi73bhriho20i3t5e6b9nvvdrhii3c201',
                size: 401361,
                eTag: 'd33c59538c1b45664a5964aac1902451',
                sequencer: '006669DE8225C19BD8'
            }
        }
    }]
}


