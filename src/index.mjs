import model from "./model.mjs";
import utils from "./utils.mjs";
import database from "./database/config.mjs";


export const handler = async (event, context) => {
    try {

        const {origin, environment, userId, ordersIds} = utils.getEventDetails(event);
        console.log("event --> :", event)
        console.log("context --> :", context);
        console.log("Origin --> :", origin);
        console.log("Environment --> :", environment);

        const db = database.getDatabaseInstance(environment)

        if (!userId || !ordersIds || !environment) throw new Error('Invalid parameters');

        if (origin === 'apiGateway' && ordersIds.length > 5) {

            const result = await model.sendEventData({
                detailType: 'MANIFEST-DOWNLOAD',
                detail: {userId: userId, ordersIds: ordersIds, environment: environment},
                source: 'MASTERSHOP-DOCUMENTS'
            });

            console.log("Send event response -->", result.data);

            return {
                statusCode: 202,
                body: JSON.stringify({
                    message: "Manifest is being generated",
                }),
            };
        }
        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;
        const ordersData = await model.getOrdersData({ordersIds: ordersIds, db: db});

        if (!ordersData || ordersData.ENVIA.length === 0 && ordersData.COORDINADORA.length === 0 && ordersData.TCC.length === 0 && ordersData._99MINUTOS.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "No data found for this orders id's",
                }),
            };
        }

        const pdfBase64 = await model.addTrackingProofsToDocument({
            ordersData: ordersData,
            pageHeight: A4_HEIGHT,
            pageWidth: A4_WIDTH
        });

        if (origin === 'EventBridge') {
            const timestamp = new Date().getTime();
            const pdfFileName = `user-${userId}-manifest-${timestamp}.pdf`;
            const s3Response = await model.uploadPdfToS3({pdfBase64: pdfBase64, pdfFileName: pdfFileName});

            console.log('Archivo PDF subido a S3:', s3Response);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Success, PDF uploaded to S3",
                }),
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": "attachment; filename=manifest.pdf",
                },
                isBase64Encoded: true,
                body: pdfBase64,
            };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to upload PDF to S3",
                error: error.message,
            }),
        };
    }
};
