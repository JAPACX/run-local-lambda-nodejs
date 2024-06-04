import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import pages from "./pages.mjs";

import axios from 'axios';
import dao from "../dao/dao.mjs";
import dto from "../dto/dto.mjs";

const s3Client = new S3Client({region: `${process.env.REGION}`});


const getOrdersData = async ({ordersIds: ordersIds, db: db}) => {
    try {
        const ordersData = await dao.getOrdersData({ordersIds: ordersIds, db: db});
        return dto.groupOrderDataByCarrier({ordersData: ordersData});
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


const resumeOrdersData = async ({ordersIds: ordersIds, db: db}) => {
    try {
        return await dao.resumeOrdersData({ordersIds: ordersIds, db: db});
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
                const pdfDoc = await pages.getMainPageByCarrierInBase64({
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
            pdfLibsDocuments.push(await pages.getConsolidatedProducts({width: pageWidth, height: pageHeight, resumedOrdersData: carriersData.resumedOrdersData, logoMastershop: logoResponses[0].data}));
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

export default {getOrdersData, uploadPdfToS3, addTrackingProofsToDocument, sendEventData, resumeOrdersData};