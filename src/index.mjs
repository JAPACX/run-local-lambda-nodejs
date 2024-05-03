import model from "./model.mjs";
import dto from "./dto.mjs";
import dao from "./dao.mjs";

export const handler = async (event, context) => {

    const ordersIncidentsEvent = event.detail.ordersWithIncidents;

    const allIncidentsTCC =  await model.getOrdersWithIncidentsTCC();

    const ordersIncidentAccountTCC = allIncidentsTCC.novedades.novedades;


    const resultMatches = dto.findMatches(ordersIncidentsEvent, ordersIncidentAccountTCC);

    for (const {idOrder, idCarrierStatusUpdate} of resultMatches) {
       const  carrierData = await dao.getOrderShipmentUpdateHistory({idOrder: idOrder, idCarrierStatusUpdate: idCarrierStatusUpdate})
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};




