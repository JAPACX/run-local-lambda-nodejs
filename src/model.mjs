import dao from "./dao.mjs";

const updateCarrierDataInOrderShipmentUpdateHistory = async ({ idOrder, idCarrierStatusUpdate, incidentData }) => {
    try {
        return await dao.updateCarrierDataInOrderShipmentUpdateHistory({ idOrder, idCarrierStatusUpdate, incidentData });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default {updateCarrierDataInOrderShipmentUpdateHistory};


