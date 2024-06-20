import {PDFDocument} from 'pdf-lib';


const groupOrderDataByCarrier = ({ordersData}) => {
    const COORDINADORA_ID = 6;
    const TCC_ID = 4;
    const MINUTOS_99_ID = 2;
    const DOMINA_ID = 5;
    const ENVIA_ID = 7;

    const parsedData = {
        COORDINADORA: [],
        ENVIA: [],
        TCC: [],
        _99MINUTOS: [],
        DOMINA:[]
    };

    ordersData.forEach(order => {
        const {
            idCarrier,
            carrierTrackingCode,
            idOrder,
            orderItems,
            fullName,
            shippingLabel,
            paymentMethod,
            shippingRate,
            totalSeller,
            phone,
            city,
            state,
            address1,
            address2
        } = order;

        const orderData = {
            idCarrier: idCarrier,
            trackingNumber: carrierTrackingCode,
            order: idOrder,
            products: orderItems,
            customer: fullName,
            shippingLabel: shippingLabel,
            paymentMethod: paymentMethod,
            shippingRate: shippingRate,
            totalSeller: totalSeller,
            phone: phone,
            city,
            state,
            address1,
            address2
        };

        switch (idCarrier) {
            case COORDINADORA_ID:
                parsedData.COORDINADORA.push(orderData);
                break;
            case TCC_ID:
                parsedData.TCC.push(orderData);
                break;
            case MINUTOS_99_ID:
                parsedData._99MINUTOS.push(orderData);
                break;
            case DOMINA_ID:
                parsedData.DOMINA.push(orderData);
                break;
            case ENVIA_ID:
                parsedData.ENVIA.push(orderData);
                break;
            default:
                break;
        }
    });

    return parsedData;
};


const mergedBase64 = async ({originalPdf, pdfArrayBase64, pageWidth, pageHeight}) => {
    const originalPdfDoc = await PDFDocument.load(Buffer.from(originalPdf, 'base64'));

    if (pdfArrayBase64.length > 0) {
        for (const pdfBase64 of pdfArrayBase64) {
            const pdfBuffer = Buffer.from(pdfBase64, 'base64');
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const pageCount = pdfDoc.getPageCount();
            for (let i = 0; i < pageCount; i++) {
                const [embeddedPage] = await originalPdfDoc.embedPdf(pdfDoc, [i]);
                const newPage = originalPdfDoc.addPage([pageWidth, pageHeight]);

                const scaleX = pageWidth / embeddedPage.width;
                const scaleY = pageHeight / embeddedPage.height;
                const scale = Math.min(scaleX, scaleY);

                newPage.drawPage(embeddedPage, {
                    x: 0,
                    y: newPage.getHeight() - embeddedPage.height * scale,
                    width: embeddedPage.width * scale,
                    height: embeddedPage.height * scale,
                });
            }
        }
    }

    return await originalPdfDoc.saveAsBase64();
};

const mergedPdfLibDocument = async (pdfDocs) => {
    const mergedPdf = await PDFDocument.create();

    for (const pdfDoc of pdfDocs) {
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    return await mergedPdf.saveAsBase64();
};


export default {groupOrderDataByCarrier, mergedBase64, mergedPdfLibDocument};