import model from "./model.mjs";


export const handler = async (event, context) => {
    try {
        const userId = event.detail.userId
        const ordersIds = event.detail.ordersIds

        const ordersDataParsed = await model.getOrdersData({ordersIds: ordersIds});
        const pdfBytes = await model.getManifest({ordersDataParsed: ordersDataParsed});
        const timestamp = new Date().getTime();
        const pdfFileName = `user-${userId}-manifest-${timestamp}.pdf`;
        const s3Response = await model.uploadPdfToS3({pdfBytes: pdfBytes, pdfFileName: pdfFileName});
        console.log(event)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success, PDF uploaded to S3",
            }),
        };

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

