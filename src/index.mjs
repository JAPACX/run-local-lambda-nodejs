import model from "./model.mjs";
import dto from "./dto.mjs";
import dao from "./dao.mjs";

export const handler = async (event, context) => {

    try {
        const ordersIncidentsEvent = event.detail.ordersWithIncidents;

        const allIncidentsTCC = await model.getOrdersWithIncidentsTCC();

        const ordersIncidentAccountTCC = allIncidentsTCC.novedades.novedades;

        let resultMatches = []
        if (ordersIncidentsEvent.length > 0 && ordersIncidentAccountTCC.length > 0) {
            resultMatches = dto.findMatches(ordersIncidentsEvent, ordersIncidentAccountTCC);
        }

        for (const {guideId, idnovedad, data, idOrder, idCarrierStatusUpdate} of resultMatches) {
            const carrierData = await model.getCarrierData({idOrder, idCarrierStatusUpdate});
            const newData = {
                idNovedadTCC: idnovedad,
                incidentData: data,
                carrierData: carrierData,
                guideId: guideId
            }
            await dao.updateCarrierData({idOrder, idCarrierStatusUpdate, newData: {...newData} });
        }

        return {
            statusCode: 200,
            body: JSON.stringify('Ejecución exitosa'),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Error al procesar el evento: ${err}`),
        };
    }
};
