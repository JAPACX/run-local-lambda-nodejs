import dao from "./dao.mjs";

const updateCarrierDataInOrderShipmentUpdateHistory = async ({ idOrder, idCarrierStatusUpdate, incidentData }) => {
    try {
        return await dao.updateCarrierDataInOrderShipmentUpdateHistory({ idOrder, idCarrierStatusUpdate, incidentData });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getOrdersWithIncidentsTCC = async () => {
    try {
        return await dao.getOrdersWithIncidentsTCC();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getCarrierData = async ({ idOrder, idCarrierStatusUpdate }) => {
    try {
        return await dao.getCarrierData({ idOrder, idCarrierStatusUpdate });
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default {updateCarrierDataInOrderShipmentUpdateHistory, getOrdersWithIncidentsTCC, getCarrierData};


