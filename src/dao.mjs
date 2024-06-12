import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import db from "./database/config.mjs";

const s3Client = new S3Client({region: 'us-east-1'});

const getS3File = async (event) => {
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
    const urls = [];

    for (let attachment of attachments) {
        if (attachment.content && attachment.filename && attachment.contentType) {
            const buffer = Buffer.from(attachment.content);
            const filename = `mailsFromCarriers/tcc/attachments/${attachment.filename}`;
            const params = {
                Bucket: 'mastershop-notification-ses',
                Key: filename,
                Body: buffer,
                ContentType: attachment.contentType
            };

            try {
                const putCommand = new PutObjectCommand(params);
                await s3Client.send(putCommand);

                const getCommand = new GetObjectCommand({
                    Bucket: params.Bucket,
                    Key: params.Key
                });

                // Genera la URL firmada 7 dias de expiración
                const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 604800 });
                urls.push(url);
                console.log(`File uploaded and signed URL generated successfully: ${filename}`);
            } catch (err) {
                console.error(`Error uploading file ${filename}:`, err);
            }
        } else {
            console.log('Invalid attachment data, skipping...');
        }
    }
    return urls;
};



export default {getS3File, getOrderData, putItemToDynamoDB, uploadAttachments};
