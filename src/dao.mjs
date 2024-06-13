import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import db from "./database/config.mjs";


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


const uploadAttachments = async ({attachments}) => {
    const s3Client = new S3Client({region: 'us-east-2'});

    const urls = [];

    for (let attachment of attachments) {
        if (attachment.content && attachment.filename && attachment.contentType) {
            const buffer = Buffer.from(attachment.content);
            const filename = `mastershop/mailsFromCarriers/tcc/attachments/${uuidv4()+attachment.filename}`;
            const params = {
                Bucket: 'bemaster-res',
                Key: filename,
                Body: buffer,
                ContentType: attachment.contentType
            };

            try {
                const putCommand = new PutObjectCommand(params);
                await s3Client.send(putCommand);

                const url = `https://cdn.bemaster.com/${encodeURIComponent(params.Key)}`;
                urls.push(url);
                console.log(`File uploaded successfully: ${filename}`);
            } catch (err) {
                console.error(`Error uploading file ${filename}:`, err);
            }
        } else {
            console.log('Invalid attachment data, skipping...');
        }
    }
    return urls;
};

const uploadHtmlToS3 = async ({htmlContent}) => {
    const s3Client = new S3Client({ region: 'us-east-2' });

    const filename = `mastershop/mailsFromCarriers/tcc/${uuidv4()}.html`;

    const buffer = Buffer.from(htmlContent, 'utf-8');
    const params = {
        Bucket: 'bemaster-res',
        Key: filename,
        Body: buffer,
        ContentType: 'text/html'
    };

    try {
        const putCommand = new PutObjectCommand(params);
        await s3Client.send(putCommand);

        const url = `https://cdn.bemaster.com/${encodeURIComponent(params.Key)}`;
        console.log(`HTML file uploaded successfully: ${filename}`);
        return url;
    } catch (err) {
        console.error(`Error uploading HTML file:`, err);
        return null;
    }
};

export default {getS3File, getOrderData, putItemToDynamoDB, uploadAttachments, uploadHtmlToS3};
