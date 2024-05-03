import model from "./model.mjs";


export const handler = async (event, context) => {
    try {
        const userId = event.detail.userId
        const ordersIds = event.detail.ordersIds
        const typeManifest = event.detail.typeManifest

        const ordersDataParsed = await model.getOrdersData({ordersIds: ordersIds});
        const pdfBytes = await model.getPrincipalPageManifest({ordersDataParsed: ordersDataParsed});
        const timestamp = new Date().getTime();
        const pdfFileName = `user-${userId}-manifest-${timestamp}.pdf`;
        // const s3Response = await model.uploadPdfToS3({pdfBytes: pdfBytes, pdfFileName: pdfFileName});


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success, PDF uploaded to S3",
            }),
            pdfFileName: pdfFileName,
            pdfBytes: pdfBytes
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

