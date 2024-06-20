import {PDFDocument, rgb, StandardFonts} from "pdf-lib";
import utils from "../utils.mjs";


const getMainPageByCarrierInBase64 = async ({
                                                carrierData,
                                                carrierName,
                                                width: A4_WIDTH,
                                                height: A4_HEIGHT,
                                                logoResponses
                                            }) => {
    try {
        const pdfDoc = await PDFDocument.create();
        let initPage = 0;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const blackColor = rgb(0, 0, 0);
        const grayColor = rgb(0.8, 0.8, 0.8);

        const logoImages = await Promise.all(
            logoResponses.map(async (response) => {
                return pdfDoc.embedPng(response.data);
            }),
        );
        const mainPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        const fontSize = 7;

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
                case 'DOMINA':
                    return logoImages[5];
                default:
                    return logoImages[0];
            }
        };

        //--------------------- Consolidado de pedidos -------------------------

        // Fondo
        page.drawRectangle({
            x: 170,
            y: 760,
            width: 230,
            height: 30,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Titulo
        mainPage.drawText(`Consolidado de Pedidos ${carrierName}`, {
            x: 190,
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
            y: 740,
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
        page.drawText(`Fecha: ${date}, ${time.toUpperCase()}`, {
            x: 280,
            y: 725,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        //-----------------------------Firmas-------------------------------------

        // Firma funcionario
        page.drawText(`Firma funcionario:`, {
            x: 420,
            y: 770,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`_______________________`, {
            x: 420,
            y: 745,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`CC:`, {
            x: 420,
            y: 730,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        page.drawText(`Placa Vehículo:`, {
            x: 420,
            y: 715,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });


        //------------------------------------------------------------------------


        //  Fondo de columnas N guia, Pedido, Productos....
        page.drawRectangle({
            x: 45,
            y: 650,
            width: 500,
            height: 30,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Columnas de hoja
        let startY = 660;
        const headerFontSize = 9;
        const rowFontSize = 7;
        const lineHeight = 32;

        const headers = [
            '#',
            'Envio',
            'Productos',
            'Destinatario',
            'Recaudo'
        ];
        const columnPositions = [50, 70, 130, 350, 490];

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
        let totalToCollect = 0;
        carrierData.forEach((row, index) => {
            let rowHeight = 0;

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
            currentPage.drawText(`Pedido: ${row.order}`, {
                x: columnPositions[1] + 5,
                y: startY - 10,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });


            //------------------------ Cliente ---------------------------------

            const clientName = row.customer.split(' ');

            let firstName = clientName.shift();
            let lastName;
            if (clientName.length === 1) {
                lastName = clientName[0];
            } else if (clientName.length >= 2) {
                lastName = clientName[1];
            } else {
                lastName = "";
            }

            currentPage.drawText(`${firstName} ${lastName}, Tel: ${row.phone}`, {
                x: columnPositions[3] + 5,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            let startYClient = startY;

            // Ubicacion
            startYClient -= 10;
            currentPage.drawText(`${row.city}, ${row.state}`, {
                x: columnPositions[3] + 5,
                y: startYClient,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            //----------------------------------------------------------------

            // Recaudo Texto
            currentPage.drawText(`${row.paymentMethod?.toLowerCase() === 'cod' ? row.totalSeller.toLocaleString() : 'NO'}`, {
                x: columnPositions[4] + 10,
                y: startY,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            // Condicional para validar si se debe mostrar el valor de recaudo
            if (row.paymentMethod?.toLowerCase() === 'cod') {
                totalToCollect += parseInt(row.totalSeller, 10);
            }

            const products = row.products;
            let productTextY = startY;
            products.forEach(({name, quantity}) => {
                let remainingText = utils.cleanText(`${name} X (${quantity} Und)`);

                while (remainingText.length > 0) {
                    const truncatedProduct = remainingText.substring(0, 60);
                    currentPage.drawText(truncatedProduct, {
                        x: columnPositions[2] + 5,
                        y: productTextY,
                        size: rowFontSize,
                        font: font,
                        color: blackColor,
                    });
                    remainingText = remainingText.substring(60).trim();
                    productTextY -= 10;
                    rowHeight += 14;
                }
            });

            startY -= Math.max(rowHeight, lineHeight);

            if (startY < 80) {
                startY = 750;
                initPage++;
                pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            }
        });

        page.drawText(`Total a recaudar $${totalToCollect.toLocaleString()}`, {
            x: 280,
            y: 710,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        return pdfDoc;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getConsolidatedProducts = async ({width: A4_WIDTH, height: A4_HEIGHT, resumedOrdersData, logoMastershop}) => {
    try {
        const pdfDoc = await PDFDocument.create();
        let initPage = 0;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const blackColor = rgb(0, 0, 0);
        const grayColor = rgb(0.8, 0.8, 0.8);


        const mainLogo = await pdfDoc.embedPng(logoMastershop);
        const mainPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        const fontSize = 7;

        const page = mainPage;

        //------------------------------------------------------------------------

        // Logo MasterShop
        mainPage.drawImage(mainLogo, {
            x: 50,
            y: 695,
            width: 100,
            height: 100,
        });

        // Relations of products
        page.drawText(`RELACION DE PRODUCTOS`, {
            x: 230,
            y: 750,
            size: fontSize + 10,
            font: boldFont,
            color: blackColor,
        });

        // Relations of products
        page.drawText(`Total a Despachar`, {
            x: 230,
            y: 730,
            size: fontSize + 8,
            font: boldFont,
            color: blackColor,
        });

        const currentDateTime = new Date();

        const optionsDate = {
            timeZone: 'America/Bogota',
        };

        const date = currentDateTime.toLocaleDateString('es-ES', optionsDate);

        // Date
        page.drawText(`Fecha: ${date}`, {
            x: 230,
            y: 700,
            size: fontSize + 8,
            font: font,
            color: blackColor,
        });


        page.drawRectangle({
            x: 45,
            y: 640,
            width: 500,
            height: 30,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Columnas de hoja
        let startY = 650;
        const headerFontSize = 9;
        const rowFontSize = 7;
        const lineHeight = 10;

        const headers = [
            'SKU',
            'ID',
            'Producto',
            'Unidades'
        ];
        const columnPositions = [60, 150, 220, 470];

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
        startY -= 30;

        resumedOrdersData.forEach((row, index) => {
            let rowHeight = 10;

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

            currentPage.drawText(`${row.sku && row.sku !== 'null' ? row.sku : '-'}`, {
                x: columnPositions[0] + 5,
                y: startY - 2,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            currentPage.drawText(`${row.idProduct}`, {
                x: columnPositions[1] + 5,
                y: startY - 2,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            currentPage.drawText(`${row.totalQuantity}`, {
                x: columnPositions[3] + 20,
                y: startY - 2,
                size: rowFontSize,
                font: font,
                color: blackColor,
            });

            let productTextY = startY;
            let remainingText = utils.cleanText(row.productName);
            while (remainingText.length > 0) {
                const truncatedProduct = remainingText.substring(0, 60);
                currentPage.drawText(truncatedProduct, {
                    x: columnPositions[2] + 5,
                    y: productTextY,
                    size: rowFontSize,
                    font: font,
                    color: blackColor,
                });
                remainingText = remainingText.substring(60).trim();
                productTextY -= 15;
                rowHeight += 15;
            }

            rowHeight = Math.max(rowHeight, lineHeight);
            startY -= rowHeight;

            if (startY < 80) {
                startY = 750;
                initPage++;
                pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
            }
        });
        return pdfDoc;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


export default {getConsolidatedProducts, getMainPageByCarrierInBase64};