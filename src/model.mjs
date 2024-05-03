import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

import axios from 'axios';
import dao from "./dao.mjs";
import dto from "./dto.mjs";

const s3Client = new S3Client({region: `${process.env.REGION}`});


const getOrdersData = async ({ordersIds: ordersIds}) => {
    try {
        const ordersData = await dao.getOrdersData({ordersIds: ordersIds});
        return dto.parseOrders(ordersData)

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


const getPrincipalPageManifest = async ({ordersDataParsed: ordersDataParsed}) => {
    try {

        const {COORDINADORA, ENVIA, TCC, _99MINUTOS, ORDERS_DATA} = ordersDataParsed

        const pdfDoc = await PDFDocument.create();
        let initPage = 0;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const blackColor = rgb(0, 0, 0);

        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        const logoUrls = [
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/mastershop_logo.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/coordinadora.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/99_minutos.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/envia.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/tcc.png',
        ];

        const logoPromises = logoUrls.map((url) =>
            axios.get(url, {responseType: 'arraybuffer'}),
        );
        const logoResponses = await Promise.all(logoPromises);
        const logoImages = await Promise.all(
            logoResponses.map(async (response) => {
                return pdfDoc.embedPng(response.data);
            }),
        );

        const spaceBetweenLines = 10;
        const mainPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        const fontSize = 10;

        const svgPath =
            'M 20,0 H 123 Q 143,0 143,20 V 80 Q 143,100 123,100 H 20 Q 0,100 0,80 V 20 Q 0,0 20,0 Z';

        const page = mainPage;

        page.drawRectangle({
            x: 45,
            y: 568,
            width: 500,
            height: 30,
            color: rgb(0.9, 0.9, 0.9),
        });

        page.drawRectangle({
            x: 170,
            y: 760,
            width: 370,
            height: 30,
            color: rgb(0.9, 0.9, 0.9),
        });

        page.moveTo(170, page.getHeight() - 5);
        page.moveDown(84);
        page.drawSvgPath(svgPath, {scale: 0.6, borderOpacity: 0.8});

        page.moveTo(265, page.getHeight() - 5);
        page.moveDown(84);
        page.drawSvgPath(svgPath, {scale: 0.6, borderOpacity: 0.8});

        page.moveTo(360, page.getHeight() - 5);
        page.moveDown(84);
        page.drawSvgPath(svgPath, {scale: 0.6, borderOpacity: 0.8});

        page.moveTo(455, page.getHeight() - 5);
        page.moveDown(84);
        page.drawSvgPath(svgPath, {scale: 0.6, borderOpacity: 0.8});

        mainPage.drawText('Consolidado de Pedidos', {
            x: 190,
            y: 770,
            size: fontSize + 2,
            font: boldFont,
            color: blackColor,
        });

        // Coordinadora
        mainPage.drawImage(logoImages[1], {
            x: 175 + (80 - 60) / 2,
            y: 730,
            width: 60,
            height: 20,
        });

        mainPage.drawText(`${COORDINADORA}`, {
            x: 213,
            y: 710,
            size: 18,
            font: font,
            color: blackColor,
        });

        // 99 minutos
        mainPage.drawImage(logoImages[2], {
            x: 260 + spaceBetweenLines + (80 - 60) / 2,
            y: 730,
            width: 60,
            height: 20,
        });

        mainPage.drawText(`${_99MINUTOS}`, {
            x: 300 + spaceBetweenLines,
            y: 710,
            size: 18,
            font: font,
            color: blackColor,
        });

        // Envia
        mainPage.drawImage(logoImages[3], {
            x: 430 + spaceBetweenLines * 3 + (80 - 60) / 2,
            y: 730,
            width: 60,
            height: 15,
        });

        mainPage.drawText(`${ENVIA}`, {
            x: 435 + 30 + spaceBetweenLines * 3,
            y: 710,
            size: 18,
            font: font,
            color: blackColor,
        });

        // Tcc Express
        mainPage.drawImage(logoImages[4], {
            x: 355 + spaceBetweenLines * 2 + (80 - 60) / 2,
            y: 730,
            width: 40,
            height: 15,
        });

        mainPage.drawText(`${TCC}`, {
            x: 355 + 30 + spaceBetweenLines * 2,
            y: 710,
            size: 18,
            font: font,
            color: blackColor,
        });

        // Logo MasterShop
        mainPage.drawImage(logoImages[0], {
            x: 50,
            y: 695,
            width: 100,
            height: 100,
        });

        let startY = 580;
        const headerFontSize = 11;
        const rowFontSize = 9;
        const lineHeight = 15;

        page.drawText(`Numero de Guías: ${ORDERS_DATA.length}`, {
            x: 50,
            y: 635,
            size: fontSize + 2,
            font: boldFont,
            color: blackColor,
        });

        const currentDateTime = new Date();

        const optionsDate = {
            timeZone: 'America/Bogota',
        };

        const optionsTime = {
            timeZone: 'America/Bogota',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const date = currentDateTime.toLocaleDateString('es-ES', optionsDate);
        const time = currentDateTime.toLocaleTimeString('es-ES', optionsTime);

        // Date
        page.drawText(`Fecha: ${date}`, {
            x: 195,
            y: 635,
            size: fontSize + 2,
            font: boldFont,
            color: blackColor,
        });

        // Time
        page.drawText(`Hora: ${time}`, {
            x: 310,
            y: 635,
            size: fontSize + 2,
            font: boldFont,
            color: blackColor,
        });

        const headers = [
            'N° Guía',
            'Pedido',
            'Productos',
            'Cliente',
            'Transportadora',
        ];
        const columnPositions = [50, 130, 190, 330, 450, A4_WIDTH - 50];

        // Headers
        headers.forEach((header, index) => {
            mainPage.drawText(header, {
                x: columnPositions[index] + 5,
                y: startY,
                size: headerFontSize,
                font: boldFont,
                color: blackColor,
            });
        });
        startY -= lineHeight * 2; // Spaces between headers

        // Draw rows

        ORDERS_DATA.forEach((row) => {
            let rowHeight = 0;

            // N° Tracking Number
            const currentPage = pdfDoc.getPage(initPage);
            currentPage.drawText(`${row.trackingNumber}`, {
                x: columnPositions[0] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Order
            currentPage.drawText(`${row.order}`, {
                x: columnPositions[1] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Column of customer and carrier
            const truncateNameCustomer =
                row.customer.length > 20
                    ? row.customer.substring(0, 20) + '...'
                    : row.customer;
            currentPage.drawText(truncateNameCustomer, {
                x: columnPositions[3],
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });
            currentPage.drawText(row.carrier, {
                x: columnPositions[4] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            const products = row.products;
            let productTextY = startY;
            products.forEach((product) => {
                const truncatedProduct =
                    product.length > 27 ? product.substring(0, 27) + '...' : product;

                currentPage.drawText(truncatedProduct, {
                    x: columnPositions[2] + 5,
                    y: productTextY,
                    size: rowFontSize,
                    font: font,
                    color: blackColor,
                });

                productTextY -= lineHeight;
                rowHeight += lineHeight;
            });

            rowHeight = Math.max(rowHeight, lineHeight);
            startY -= rowHeight;
            if (startY < 50) {
                startY = 830;
                initPage++;
                pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            }
        });

        return await typeManifest({pdfDoc: pdfDoc, typeManifest: typeManifest, data: ORDERS_DATA});

    } catch (error) {
        console.error(error);
        throw error;
    }
};

const typeManifest = async ({pdfDoc, typeManifest, data}) => {
    try {
        switch (typeManifest) {
            default:
                const arrayOfPdfBuffers = await dto.generateArrayOfPdfBufferWithUrls({pdfUrls: data.map((row) => row.shippingLabel)})
                return await addPdfsToDocument({originalPdfDoc: pdfDoc, ArrayOfPdfBuffers: arrayOfPdfBuffers});
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const addPdfsToDocument = async ({originalPdfDoc, ArrayOfPdfBuffers}) => {
    try {
        return await dto.addPdfsToDocument({originalPdfDoc: originalPdfDoc, ArrayOfPdfBuffers: ArrayOfPdfBuffers});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const uploadPdfToS3 = async ({pdfBytes: pdfBytes, pdfFileName: pdfFileName}) => {
    try {
        const command = new PutObjectCommand({
            Bucket: 'bemaster-res',
            Key: `mastershop/users/manifest/${pdfFileName}`,
            Body: pdfBytes,
        });
        return await s3Client.send(command);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {getOrdersData, getPrincipalPageManifest, uploadPdfToS3}







