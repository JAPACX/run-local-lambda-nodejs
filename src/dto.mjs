import axios from "axios";
import {PDFDocument} from 'pdf-lib';


const parseOrders = (ordersData) => {
    const parsedData = {
        COORDINADORA: 0,
        ENVIA: 0,
        TCC: 0,
        _99MINUTOS: 0,
        ORDERS_DATA: []
    };

    ordersData.forEach(order => {


        const orderData = {
            trackingNumber: order.carrierTrackingCode,
            order: order.idOrder,
            products: order.orderItems.map(item => item.name),
            customer: order.fullName,
            shippingLabel: order.shippingLabel,
            carrier: null
        };
        parsedData.ORDERS_DATA.push(orderData)

        switch (order.idCarrier) {
            case 6:
                parsedData.COORDINADORA++
                orderData.carrier = 'COORDINADORA';
                break;
            case 4:
                parsedData.TCC++
                orderData.carrier = 'TCC';
                break;
            case 2:
                parsedData._99MINUTOS++
                orderData.carrier = '99MINUTOS';
                break;
            case 7:
                parsedData.ENVIA++
                orderData.carrier = 'ENVIA';
                break;
            default:
                break;
        }
    });

    return parsedData;
}

const generateArrayOfPdfBufferWithUrls = async ({pdfUrls}) => {
    const pdfPromises = pdfUrls.map(url =>
        axios.get(url, {responseType: 'arraybuffer', timeout: 600000})
            .then(response => response.data)
            .catch(error => {
                console.error(`Error fetching PDF from URL: ${url}`);
                return null;
            })
    );
    const results = await Promise.allSettled(pdfPromises);

    return results
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);
}


const addPdfsToDocument = async ({originalPdfDoc, ArrayOfPdfBuffers, fixedWidth = 595, fixedHeight = 800}) => {

    for (const pdfBuffer of ArrayOfPdfBuffers) {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
            const [embeddedPage] = await originalPdfDoc.embedPdf(pdfDoc, [i]);
            const newPage = originalPdfDoc.addPage([fixedWidth, fixedWidth/2]);

            const scaleX = fixedWidth / embeddedPage.width;
            const scaleY = fixedHeight / embeddedPage.height;
            const scale = Math.min(scaleX, scaleY);

            newPage.drawPage(embeddedPage, {
                x: 0,
                y: newPage.getHeight() - embeddedPage.height * scale,
                width: embeddedPage.width * scale,
                height: embeddedPage.height * scale,
            });
        }
    }
    return await originalPdfDoc.save();
};

export default {parseOrders, addPdfsToDocument, generateArrayOfPdfBufferWithUrls};

