import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import db from "./database/config.mjs";
import fs from "fs/promises";

const getS3File = async (event) => {
    const s3Client = new S3Client({region: 'us-east-1'});
    const s3Event = event.Records[0];
    const bucketName = s3Event.s3.bucket.name;
    const objectKey = decodeURIComponent(s3Event.s3.object.key.replace(/\+/g, ' '));

    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    const command = new GetObjectCommand(params);
    return await s3Client.send(command);
}

const getOrderData = async ({carrierTrackingCode}) => {
    try {
        const query = `select idOrder from \`order\` where carrierTrackingCode = '${carrierTrackingCode}';`
        return await db.query(query, {
            type: db.QueryTypes.SELECT
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const putItemToDynamoDB = async (data) => {

    const dbClient = new DynamoDBClient({
        region: 'us-east-1',
    });
    const docClient = DynamoDBDocumentClient.from(dbClient);


    const params = {
        TableName: 'Mastershop-Order-Carrier-Conversation-Dev',
        Item: data
    };

    try {
        const command = new PutCommand(params);
        const result = await docClient.send(command);
        console.log('Item inserted successfully:', result);
        return result;
    } catch (error) {
        console.error('Error inserting item to DynamoDB:', error);
        throw error;
    }
}

const  uploadAttachments = async ({attachments}) => {
    for (let attachment of attachments) {
        if (attachment.content && attachment.filename && attachment.contentType) {
            const buffer = Buffer.from(attachment.content);
            const filename = attachment.filename;
            try {
                await fs.writeFile(filename, buffer);
                console.log(`File saved successfully: ${filename}`);
            } catch (err) {
                console.error(`Error writing file ${filename}:`, err);
            }
        } else {
            console.log('Invalid attachment data, skipping...');
            console.log('Attachment content exists:', attachment.content != null);
            console.log('Attachment filename:', attachment.filename);
            console.log('Attachment contentType:', attachment.contentType);
        }
    }
}


export default {getS3File, getOrderData, putItemToDynamoDB, uploadAttachments};
