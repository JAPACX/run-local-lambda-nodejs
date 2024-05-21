import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

import axios from 'axios';
import dao from "./dao.mjs";
import dto from "./dto.mjs";
import utils from "./utils.mjs";

const s3Client = new S3Client({region: `${process.env.REGION}`});


const getOrdersData = async ({ordersIds: ordersIds, db: db}) => {
    try {

        const ordersData = await dao.getOrdersData({ordersIds: ordersIds, db: db});
        return dto.parseOrders({ordersData: ordersData});

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const sendEventData = async ({detailType, detail, source}) => {
    try {
        const URL_API = process.env.URL_API_SEND_EVENT;
        const parameter = {
            detail,
            detailType,
            source,
        };

        return await axios.post(
            `${URL_API}`,
            parameter,
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
}


const getMainPageByCarrierInBase64 = async ({carrierData, carrierName, width, height, logoResponses}) => {
    try {


        const pdfDoc = await PDFDocument.create();
        let initPage = 0;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const blackColor = rgb(0, 0, 0);
        const grayColor = rgb(0.8, 0.8, 0.8);

        const A4_WIDTH = width;
        const A4_HEIGHT = height;

        const logoImages = await Promise.all(
            logoResponses.map(async (response) => {
                return pdfDoc.embedPng(response.data);
            }),
        );
        const mainPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        const fontSize = 10;

        const page = mainPage;


        const getLogoBufferByCarrierName = ({carrierName: carrierName}) => {
            switch (carrierName) {
                case 'COORDINADORA':
                    return logoImages[1];
                case '99MINUTOS':
                    return logoImages[2];
                case 'ENVIA':
                    return logoImages[3];
                case 'TCC':
                    return logoImages[4];
                default:
                    return logoImages[0];
            }
        }

        //--------------------- Consolidado de pedidos -------------------------

        // Fondo
        page.drawRectangle({
            x: 170,
            y: 760,
            width: 370,
            height: 30,
            color: rgb(0.9, 0.9, 0.9),
        });

        // Titulo
        mainPage.drawText(`Consolidado de Pedidos ${carrierName}`, {
            x: 230,
            y: 770,
            size: fontSize + 2,
            font: boldFont,
            color: blackColor,
        });

        //------------------------------------------------------------------------

        // Logo transportadora
        mainPage.drawImage(getLogoBufferByCarrierName({carrierName: carrierName}), {
            x: 185,
            y: 710,
            width: 75,
            height: 40,
        });

        // Logo MasterShop
        mainPage.drawImage(logoImages[0], {
            x: 50,
            y: 695,
            width: 100,
            height: 100,
        });

        page.drawText(`Numero de Guías: ${carrierData.length}`, {
            x: 280,
            y: 735,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`Total a recaudar`, {
            x: 410,
            y: 735,
            size: fontSize,
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
            x: 280,
            y: 720,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        // Time
        page.drawText(`Hora: ${time}`, {
            x: 280,
            y: 705,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });


        //-----------------------------Firmas-------------------------------------

        // Firma funcionario
        page.drawText(`Firma funcionario: (${carrierName})`, {
            x: 70,
            y: 670,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`_______________________`, {
            x: 70,
            y: 635,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`CC:`, {
            x: 70,
            y: 615,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        // Firma Auxiliar
        page.drawText(`Firma Auxiliar: (${carrierName})`, {
            x: 250,
            y: 670,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`_______________________`, {
            x: 250,
            y: 635,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`CC:`, {
            x: 250,
            y: 615,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        // Firma Bodega
        page.drawText(`Firma Bodega`, {
            x: 420,
            y: 670,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`_______________________`, {
            x: 420,
            y: 635,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`Placa vehiculo:`, {
            x: 420,
            y: 615,
            size: fontSize - 2,
            font: boldFont,
            color: blackColor,
        });


        //------------------------------------------------------------------------


        //  Fondo de columnas N guia, Pedido, Productos....
        page.drawRectangle({
            x: 45,
            y: 570,
            width: 500,
            height: 30,
            color: rgb(0.9, 0.9, 0.9),
        });

        // Columnas de hoja
        let startY = 580;
        const headerFontSize = 9;
        const rowFontSize = 7;
        const lineHeight = 120;

        const headers = [
            '#',
            'N° Guía',
            'N° Pedido',
            'Nombre del producto',
            'Und',
            'Recaudo',
            'Cliente',
        ];
        const columnPositions = [50, 70, 130, 190, 330, 360, 410];

        // Headers
        headers.forEach((header, index) => {
            mainPage.drawText(`${header}`, {
                x: columnPositions[index] + 5,
                y: startY,
                size: headerFontSize,
                font: boldFont,
                color: blackColor,
            });
        });
        startY -= 30; // Spaces between header and rows

        // Draw rows
        let totalToCollect = 0
        carrierData.forEach((row, index) => {
            let rowHeight = 50;

            const currentPage = pdfDoc.getPage(initPage);


            if (index > 0) {
                currentPage.drawText(`________________________________________________________________________________________________________________________________`, {
                    x: 45,
                    y: startY + 20,
                    size: rowFontSize,
                    font: font,
                    color: grayColor,
                });
            }

            // #
            currentPage.drawText(`${index + 1}`, {
                x: columnPositions[0] + 5,
                y: startY - 2,
                size: rowFontSize + 3,
                font: font,
                color: blackColor,
            });

            // N° Guia
            currentPage.drawText(`${row.trackingNumber}`, {
                x: columnPositions[1] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Tarifa de envio Texto
            currentPage.drawText(`Valor envio:`, {
                x: columnPositions[1] + 5,
                y: startY - 18,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Tarifa de envio
            currentPage.drawText(`$${row.shippingRate.toLocaleString()}`, {
                x: columnPositions[2] + 5,
                y: startY - 18,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });


            // N° Pedido
            currentPage.drawText(`${row.order}`, {
                x: columnPositions[2] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            //------------------------ Cliente ---------------------------------

            const fullName = row.customer.split(' ');

            let firstName = '';
            let lastName = null;

            if (fullName.length <= 2 || row.customer.length < 40) {
                firstName = row.customer;
            } else {
                firstName = fullName.slice(0, 2).join(' ');
                lastName = fullName.slice(2).join(' ');
            }

            currentPage.drawText(`${firstName} `, {
                x: columnPositions[6] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            let startYClient = startY

            if (lastName) {
                startYClient = startY - 15
                currentPage.drawText(`${lastName} `, {
                    x: columnPositions[6] + 5,
                    y: startYClient,
                    size: rowFontSize,
                    font: font,
                    color: blackColor,
                });

            }

            // Telefono
            startYClient -= 15
            currentPage.drawText(`Tel: ${row.phone} `, {
                x: columnPositions[6] + 5,
                y: startYClient,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Ciudad
            startYClient -= 15
            currentPage.drawText(`Ciudad: ${row.city} `, {
                x: columnPositions[6] + 5,
                y: startYClient,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Departamento
            startYClient -= 15
            currentPage.drawText(`Dpto: ${row.state} `, {
                x: columnPositions[6] + 5,
                y: startYClient,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Direccion
            startYClient -= 15;

            const address1 = row.address1;
            const maxLength = 25;

            if (address1.length > maxLength) {
                const lines = [];
                let remainingText = address1;

                while (remainingText.length > 0) {
                    const line = remainingText.substring(0, maxLength);
                    lines.push(line);
                    remainingText = remainingText.substring(maxLength);
                }

                lines.forEach((line, index) => {
                    currentPage.drawText(index === 0 ? `Direccion: ${line}` : line, {
                        x: columnPositions[6] + 5,
                        y: startYClient - index * 15,
                        size: rowFontSize,
                        font: font,
                        color: blackColor,
                    });
                });
            } else {
                currentPage.drawText(`Direccion: ${address1}`, {
                    x: columnPositions[6] + 5,
                    y: startYClient,
                    size: rowFontSize,
                    font: font,
                    color: blackColor,
                });
            }


            //----------------------------------------------------------------

            // Recaudo Texto
            currentPage.drawText(`${row.paymentMethod?.toLowerCase() === 'cod' ? row.totalSeller.toLocaleString() : 'NO'}`, {
                x: columnPositions[5] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Condicional para validar si se debe mostrar el valor de recaudo
            if (row.paymentMethod?.toLowerCase() === 'cod') {
                totalToCollect += parseInt(row.totalSeller)
            }

            const products = row.products;
            let productTextY = startY;
            products.forEach(({name, quantity}) => {
                let remainingText = utils.cleanText(name);

                currentPage.drawText(`(${quantity})`, {
                    x: columnPositions[4] + 5,
                    y: productTextY,
                    size: rowFontSize,
                    font: font,
                    color: blackColor,
                });

                while (remainingText.length > 0) {
                    const truncatedProduct = remainingText.substring(0, 33);
                    currentPage.drawText(truncatedProduct, {
                        x: columnPositions[3] + 5,
                        y: productTextY,
                        size: rowFontSize,
                        font: font,
                        color: blackColor,
                    });
                    remainingText = remainingText.substring(33).trim();
                    productTextY -= 15;
                    rowHeight += 15;
                }

            });


            rowHeight = Math.max(rowHeight, lineHeight);
            startY -= rowHeight;
            if (startY < 80) {
                startY = 750;
                initPage++;
                pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            }
        });
        // Total a recaudar Valor
        page.drawText(`$${totalToCollect.toLocaleString()}`, {
            x: 415,
            y: 705,
            size: fontSize + 5,
            font: boldFont,
            color: blackColor,
        });

        // Documento sin guardar en algun formato
        return pdfDoc

    } catch (error) {
        console.error(error);
        throw error;
    }
};

const resumeCarriers = async ({carriersData, pageWidth, pageHeight}) => {
    try {

        const pdfLibsDocuments = [];

        const logoUrls = [
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/mastershop_logo.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/coordinadora.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/99_minutos.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/envia.png',
            'https://cdn.bemaster.com/mastershop/media/images/logos/logos_manifiesto/tcc.png',
        ];

        const logoPromises = logoUrls.map((url) => axios.get(url, {responseType: 'arraybuffer'}));
        const logoResponses = await Promise.all(logoPromises);

        const carriers = [
            {data: carriersData.TCC, name: 'TCC'},
            {data: carriersData.COORDINADORA, name: 'COORDINADORA'},
            {data: carriersData.ENVIA, name: 'ENVIA'},
            {data: carriersData._99MINUTOS, name: '99MINUTOS'}
        ];

        for (const carrier of carriers) {
            if (carrier.data.length) {
                const pdfDoc = await getMainPageByCarrierInBase64({
                    carrierData: carrier.data,
                    carrierName: carrier.name,
                    width: pageWidth,
                    height: pageHeight,
                    logoResponses: logoResponses
                });
                pdfLibsDocuments.push(pdfDoc);
            }
        }

        if (pdfLibsDocuments.length) {
            return await dto.mergedPdfLibDocument(pdfLibsDocuments);
        } else {
            throw new Error('No carrier data available');
        }
    } catch (error) {
        console.error(` Error: ${error}`);
        throw error;
    }
}

const addTrackingProofsToDocument = async ({ordersData, pageHeight, pageWidth}) => {
    try {
        const mainPagesBase64 = await resumeCarriers({
            carriersData: ordersData,
            pageHeight,
            pageWidth
        });

        const allShippingLabels = [
            ...ordersData.COORDINADORA,
            ...ordersData.ENVIA,
            ...ordersData.TCC,
            ...ordersData._99MINUTOS
        ].filter(order => order.shippingLabel).map(order => order.shippingLabel);

        const trackingProofsBase64 = await dao.arrayBase64FromUrls({pdfUrls: allShippingLabels});

        return await dto.mergedBase64({
            originalPdf: mainPagesBase64,
            pdfArrayBase64: trackingProofsBase64,
            pageHeight,
            pageWidth
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const uploadPdfToS3 = async ({pdfBase64, pdfFileName}) => {
    try {

        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        const command = new PutObjectCommand({
            Bucket: 'bemaster-res',
            Key: `mastershop/users/manifest/${pdfFileName}`,
            Body: pdfBuffer,
        });

        return await s3Client.send(command);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default {getOrdersData, uploadPdfToS3, addTrackingProofsToDocument, sendEventData};