import db from "./database/config.mjs";
import axios from "axios";

const updateCarrierData = async ({idOrder, idCarrierStatusUpdate, newData}) => {
    try {
        const query = `
      UPDATE orderShipmentUpdateHistory
      SET carrierData = '${JSON.stringify(newData)}'
      WHERE idOrder = ${idOrder} AND idCarrierStatusUpdate = ${idCarrierStatusUpdate}
      ORDER BY createdAt DESC
      LIMIT 1;
    `;

        return await db.query(query, {
            type: db.QueryTypes.UPDATE
        });
    } catch (error) {
        console.error("Error updating carrier data:", error);
        throw error;
    }
};



export default {updateCarrierData};


