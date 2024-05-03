import db from "./database/config.mjs";

const getOrdersData = async ({ ordersIds }) => {
    try {
        const query = `
      SELECT
        o.idOrder,
        c.fullName,
        o.idCarrier,
        o.carrierTrackingCode,
        JSON_EXTRACT(o.carrierTracking, '$.shipping_label') AS shippingLabel,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'name', oi.name,
            'quantity', oi.quantity
          )
        ) AS orderItems
      FROM
        \`order\` o
      INNER JOIN
        orderItem oi ON o.idOrder = oi.idOrder
      INNER JOIN 
        customer c ON o.idCustomer = c.idCustomer
      WHERE
        o.idOrder IN (${ordersIds.join(', ')})
      GROUP BY
        o.idOrder, o.carrierTracking;
    `;

        return await db.query(query, {
            type: db.QueryTypes.SELECT
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export default { getOrdersData };
