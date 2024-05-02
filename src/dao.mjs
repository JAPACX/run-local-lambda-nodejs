import db from "./database/config.mjs";

const postShipmentUpdate = async (
    idCarrierStatusUpdate,
    carrierData,
    idOrder,
    idShipmentUpdate,
    createdAt
) => {
  try {
    const lastUpdateQuery = `
            SELECT idCarrierStatusUpdate FROM orderShipmentUpdateHistory
            WHERE idOrder = ?
            ORDER BY createdAt DESC
            LIMIT 1;
        `;
    const [lastUpdate] = await db.query(lastUpdateQuery, {
      replacements: [idOrder],
      type: db.QueryTypes.SELECT
    });

    if (lastUpdate  && lastUpdate.idCarrierStatusUpdate === idCarrierStatusUpdate) {
      console.log('No insertion made as the latest carrier status update is the same as the new one.');
      return { message: "No insertion made as the latest carrier status update is the same as the new one." };
    }

    const carrierDataString = JSON.stringify(carrierData);
    const status = idShipmentUpdate ? 'PENDING' : null;
    const queryText = `
            INSERT INTO orderShipmentUpdateHistory
            (idOrder, idCarrierStatusUpdate, carrierData, createdAt, updatedAt, idShipmentUpdate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

    await db.query(queryText, {
      replacements: [idOrder, idCarrierStatusUpdate, carrierDataString, createdAt, createdAt, idShipmentUpdate, status],
      type: db.QueryTypes.INSERT
    });

    console.log('Shipment update posted successfully');
    return { message: "Shipment update posted successfully" };
  } catch (err) {
    console.error('Error in postShipmentUpdate:', err);
    throw err;
  }
};
const status = async (ID_CARRIER) => {
  try {
    const queryText = `
        SELECT idCarrierStatusUpdate,carrierStatusUpdate.idStatus,status.name
        FROM carrierStatusUpdate
        INNER JOIN status ON carrierStatusUpdate.idStatus = status.idStatus
        WHERE carrierStatusUpdate.idCarrierStatusUpdate in (SELECT idCarrierStatusUpdate FROM carrierStatusUpdate WHERE idCarrier = ${ID_CARRIER});
    `;

    const res =  await db.query(queryText, {
      replacements: [],
      type: db.QueryTypes.SELECT
    });

    console.log('Status get success');
    console.log('res',res)
    return res;
  } catch (err) {
    console.error('Error en postShipmentUpdate:', err);
    throw err;
  }
};





export default {  postShipmentUpdate,status };
