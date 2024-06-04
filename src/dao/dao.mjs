import axios from "axios";

const getOrdersData = async ({ordersIds, db}) => {
    try {
        const query = `
      SELECT o.idOrder,
       o.idCarrier,
       o.paymentMethod,
       o.carrierTrackingCode,
       o.shippingRate,
       o.totalSeller,
       c.fullName,
       c.phone,
       JSON_EXTRACT(o.carrierTracking, '$.shipping_label')  AS shippingLabel,
       JSON_EXTRACT(o.shippingAddress, '$.city')            AS city,
       JSON_EXTRACT(o.shippingAddress, '$.state')           AS state,
       JSON_EXTRACT(o.shippingAddress, '$.address1')        AS address1,
       JSON_EXTRACT(o.shippingAddress, '$.address2')        AS address2,
       JSON_ARRAYAGG(
               JSON_OBJECT(
                       'name',
                       CASE
                           WHEN v.name = 'Default Variant' THEN p.name
                           ELSE CONCAT(p.name, ' ', v.name)
                           END,
                       'quantity', oi.quantity
               )
       )                                                     AS orderItems
      FROM \`order\` o
               INNER JOIN
           orderItem oi ON o.idOrder = oi.idOrder
               INNER JOIN
           customer c ON o.idCustomer = c.idCustomer
               INNER JOIN
           db_bemaster_aff.product p ON oi.idProduct = p.idProduct
               INNER JOIN
           db_bemaster_aff.variant v ON oi.idVariant = v.idVariant
      WHERE o.idOrder IN (${ordersIds.join(', ')})
        AND carrierTrackingCode is not null
        AND carrierTrackingCode > 0
      GROUP BY o.idOrder;
    `;

        return await db.query(query, {
            type: db.QueryTypes.SELECT
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const resumeOrdersData = async ({ordersIds, db}) => {
    try {
        const query = `
        SELECT
        p.idProduct,
        v.sku,
        CASE
            WHEN v.name = 'Default Variant' THEN p.name
            ELSE CONCAT(p.name, ' ', v.name)
        END AS productName,
        SUM(oi.quantity) AS totalQuantity
        FROM \`order\` o
        INNER JOIN orderItem oi ON o.idOrder = oi.idOrder
        INNER JOIN customer c ON o.idCustomer = c.idCustomer
        INNER JOIN db_bemaster_aff.product p ON oi.idProduct = p.idProduct
        INNER JOIN db_bemaster_aff.variant v ON oi.idVariant = v.idVariant
        WHERE o.idOrder IN (${ordersIds.join(', ')})
          AND carrierTrackingCode IS NOT NULL
          AND carrierTrackingCode > 0
        GROUP BY v.sku, p.idProduct, productName;
        `;

        return await db.query(query, {
            type: db.QueryTypes.SELECT
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const arrayBase64FromUrls = async ({pdfUrls}) => {
    const retryCount = 3;

    const pdfPromises = pdfUrls.map(url => {
        let retries = 0;

        const fetchPdf = () => {
            return axios.get(url, {responseType: 'arraybuffer', timeout: 600000})
                .then(response => Buffer.from(response.data).toString('base64'))
                .catch(error => {
                    if (retries < retryCount) {
                        retries++;
                        console.error(`Error fetching PDF from URL: ${url}. Retrying (${retries}/${retryCount})...`);
                        return fetchPdf();
                    } else {
                        console.error(`Failed to fetch PDF from URL: ${url} after ${retryCount} retries.`);
                        return null;
                    }
                });
        };

        return fetchPdf();
    });

    return Promise.allSettled(pdfPromises)
        .then(results => results
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value)
        );
};

export default {getOrdersData, resumeOrdersData, arrayBase64FromUrls};