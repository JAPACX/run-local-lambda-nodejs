import model from "./model.mjs";
import utils from "./utils/utils.mjs";

export const handler = async (event, context) => {
    try {
        console.log("Event ->",event);
        console.log("Object ->", event.Records[0].s3);

        const {subject, text, html, attachments} = await model.getParsedEmail(event);

        const result = utils.validateEmailContent(subject, text);

        let idOrder;

        if (result.shipmentCode) [idOrder] = await model.getOrderData({carrierTrackingCode: result.shipmentCode});

        if (result.isValid  && idOrder && !attachments.length ) {
            const resultUploadHtml = await model.uploadHtmlToS3({htmlContent: html});
            const result = await model.putItemToDynamoDB({
                    idOrder: idOrder.idOrder,
                    idMessage: context.logStreamName,
                    originResponse: 'carrier',
                    date: new Date().toISOString(),
                    subject: subject,
                    bodyHtml: resultUploadHtml
                }
            );
            console.log(result);
        } else if (result.isValid && idOrder && attachments.length ) {
            const resultUploadHtml = await model.uploadHtmlToS3({htmlContent: html});
            const resultUploadAttachments = await model.uploadAttachments({attachments});
            const result = await model.putItemToDynamoDB({
                    idOrder: idOrder.idOrder,
                    idMessage: context.logStreamName,
                    originResponse: 'carrier',
                    date: new Date().toISOString(),
                    subject: subject,
                    bodyHtml: resultUploadHtml,
                    urlsLocation: resultUploadAttachments
                }
            );
            console.log(result);
        } else {
            console.log("send alert to check template");
        }

    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify(`Error al procesar el evento: ${err}`),
        };
    }
};



