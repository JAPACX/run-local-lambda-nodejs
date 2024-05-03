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
            const carrierData = await dao.getCarrierData({idOrder, idCarrierStatusUpdate});
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


// if (resultMatches.length > 0) {
//     const updatePromises = resultMatches.map(({idOrder, idCarrierStatusUpdate, idnovedad, data}) => {
//         return dao.updateCarrierDataWithNewProperties({
//             idOrder: idOrder,
//             idCarrierStatusUpdate: idCarrierStatusUpdate,
//             idNovedadTCC: idnovedad,
//             incidentData: data
//         });
//     });
//
//     const results = await Promise.allSettled(updatePromises);
//
//     results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//             console.log(`Actualización exitosa para el pedido con idOrder ${resultMatches[index].idOrder}`);
//         } else {
//             console.error(`Error al actualizar el pedido con idOrder ${resultMatches[index].idOrder}:`, result.reason);
//         }
//     });
// } else {
//     console.log("No se encontraron elementos en resultMatches, no se realizaron actualizaciones.");
// }


const exampleGuide = {
    "idNovedadTCC": "31026652562479821859310723872361971886",
    "incidentData": {
        "cuenta": "5872600",
        "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN",
        "idnovedad": "31026652562479821859310723872361971886",
        "remitente": "PRIVILEGE TEAM",
        "atribuible": "",
        "ceoporigen": "MEDELLÍN",
        "ceopdestino": "BOGOTÁ",
        "fecharemesa": "2024-04-30",
        "tipogestion": "GESTIÓN",
        "ciudadorigen": "MEDELLÍN",
        "destinatario": "CAMILOPARRA",
        "numeroremesa": "609227329",
        "tiposolucion": "RE-OFRECIMIENTO,DEVOLUCION,CONTINUACION,OTRA",
        "ciudaddestino": "BOGOTÁ, D.C.",
        "codigonovedad": "103451770",
        "estadonovedad": "PLANTEADA",
        "idtiponovedad": "947",
        "correosolucion": "sacnovedadesmed@tcc.com.co",
        "unidadenegocio": "MENSAJERIA",
        "limiteregistros": "1000",
        "telefonosolucion": "",
        "comentariosnovedad": "CONFIRMAR DIRECCION PARA SU ENTREGA",
        "complementonovedad": "DIRECCIÓN ERRADA",
        "departamentoorigen": "ANTIOQUIA",
        "descripcionnovedad": "Su mercancía se encuentra en centro de operación destino. Aún no ha sido entregada al destinatario ya que se encontró una diferencia entre los datos que acompañan la mercancía vs la guía. Por lo tanto, estamos en verificación de la información para continuar con el proceso de entrega. Lo invitamos a que se comunique a través de nuestros canales de contacto para confirmar los datos del destinatario. ",
        "departamentodestino": "BOGOTA, D.C.",
        "fechaplanteanovedad": "2024-05-02 09:27:00",
        "observacionesremesa": "# 66-09 Apto 905",
        "imputabilidadnovedad": "CLIENTE",
        "direcciondestinatario": "CARRERA 13"
    }

}

