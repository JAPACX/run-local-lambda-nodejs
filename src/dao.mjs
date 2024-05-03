import db from "./database/config.mjs";
import axios from "axios";

const updateCarrierDataInOrderShipmentUpdateHistory = async ({ idOrder, idCarrierStatusUpdate, incidentData }) => {
  try {
    const query = `
      UPDATE orderShipmentUpdateHistory
      SET carrierData = JSON_SET(
        COALESCE(carrierData, '{}'), 
        '$.incidentInfo', 
        '${JSON.stringify(incidentData)}'
      )
      WHERE idOrder = ${idOrder} AND idCarrierStatusUpdate = ${idCarrierStatusUpdate}
      ORDER BY createdAt DESC
      LIMIT 1;
    `;

    return await db.query(query, {
      type: db.QueryTypes.UPDATE
    });
  } catch (error) {
    console.error("Error updating orders:", error);
    throw error;
  }
};

const getOrderShipmentUpdateHistory = async ({ idOrder, idCarrierStatusUpdate }) => {
  try {
    const query = `select carrierData from orderShipmentUpdateHistory where idOrder = ${idOrder} and idCarrierStatusUpdate = ${idCarrierStatusUpdate} order by createdAt desc limit 1`;

    return await db.query(query, {
      type: db.QueryTypes.SELECT
    });
  } catch (error) {
    console.error("Error updating orders:", error);
    throw error;
  }
};

const getOrdersWithIncidentsTCC = async () => {
  try {
    const URL_API = "https://tccrestify-dot-tcc-cloud.appspot.com/novedades/v2/consultarnovedades";

    const body = {
      "identificacion": "901320851",
      "fechainicial": "2024-04-01",
      "fechafinal": "2024-04-26",
      "estadosnovedad": [
        "1",
        "2",
        "3",
        "4"
      ],
      "remesas": [],
      "cuentas": [],
      "unidadesnegocio": [
        "1",
        "2"
      ],
      "tiposgestion": [
        "1",
        "2"
      ],
      "fuente": "PWP"
    };

    const headers = {
      "authority": "tccrestify-dot-tcc-cloud.appspot.com",
      "accept": "application/json, text/plain, */*",
      "accept-language": "es-ES,es;q=0.7",
      "accesstoken": "TCCNTSEESUHRMHRG0TPM",
      "accesstokenenc": "356432476A5848342F456D6452732B51494248584E31364F6E4452524262686E376F5133706349684B6D5769774B5547634C534730413D3D",
      "appid": "0e5cf9f1f46bea0eeb523e966fe1b795198feda1a11ca18b9746f3cf4b181156",
      "content-type": "application/json;charset=UTF-8",
      "origin": "https://app.tcc.com.co",
      "referer": "https://app.tcc.com.co/",
      "sec-ch-ua": "\"Brave\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    };

    const response =  await axios.post(
        URL_API,
        body,
        {headers}
    );

    response.data.novedades = incidentsMocked

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default { updateCarrierDataInOrderShipmentUpdateHistory, getOrdersWithIncidentsTCC, getOrderShipmentUpdateHistory };


const incidentsMocked = {
  "cliente": {
    "tipoidentificacion": "NIT",
    "identificacion": "901320851",
    "razonsocial": "PRIVILEGE TEAM S.A.S",
    "direccion": "CL 33 A 71 10 MEDELLÍN ANTIOQUIA",
    "telefono": "",
    "cuentas": [
      {
        "codigo": "1164101",
        "nombre": "PRIVILEGE TEAM S.A.S-RP 1164101"
      },
      {
        "codigo": "5872601",
        "nombre": "PRIVILEGE TEAM S.A.S-RP 5872601"
      },
      {
        "codigo": "5872600",
        "nombre": "PRIVILEGE TEAM S.A.S 5872600"
      },
      {
        "codigo": "1164100",
        "nombre": "PRIVILEGE TEAM S.A.S 1164100"
      }
    ]
  },
  "novedades": [
    {
      "idnovedad": "30117028355369137696092455331665937227",
      "codigonovedad": "103452226",
      "idtiponovedad": "947",
      "unidadenegocio": "MENSAJERIA",
      "numeroremesa": "609231861",
      "fecharemesa": "2024-04-30",
      "cuenta": "5872600",
      "remitente": "PRIVILEGE TEAM",
      "ciudadorigen": "MEDELLÍN",
      "departamentoorigen": "ANTIOQUIA",
      "ceoporigen": "MEDELLÍN",
      "destinatario": "BEATRZ EUGENIAANGEL CARRILLO",
      "direcciondestinatario": "EDIFICIO HELVÃ©TIA",
      "ciudaddestino": "PEREIRA",
      "departamentodestino": "RISARALDA",
      "ceopdestino": "PEREIRA",
      "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN",
      "complementonovedad": "DIRECCIÓN ERRADA",
      "descripcionnovedad": "Su mercancía se encuentra en centro de operación destino. Aún no ha sido entregada al destinatario ya que se encontró una diferencia entre los datos que acompañan la mercancía vs la guía. Por lo tanto, estamos en verificación de la información para continuar con el proceso de entrega. Lo invitamos a que se comunique a través de nuestros canales de contacto para confirmar los datos del destinatario. ",
      "comentariosnovedad": "LA DIRECCION ESTA INCOMPLETA FALTA EL BARRIO O SECTOR SIN NOMENCLATURA",
      "fechaplanteanovedad": "2024-05-02 10:30:00",
      "estadonovedad": "PLANTEADA",
      "imputabilidadnovedad": "CLIENTE",
      "atribuible": "",
      "tipogestion": "GESTIÓN",
      "correosolucion": "sacnovedadesmed@tcc.com.co",
      "telefonosolucion": "",
      "tiposolucion": "RE-OFRECIMIENTO,DEVOLUCION,CONTINUACION,OTRA",
      "limiteregistros": "1000",
      "observacionesremesa": "Apto 401"
    },
    {
      "idnovedad": "31026652562479821859310723872361971886",
      "codigonovedad": "103451770",
      "idtiponovedad": "947",
      "unidadenegocio": "MENSAJERIA",
      "numeroremesa": "609227329",
      "fecharemesa": "2024-04-30",
      "cuenta": "5872600",
      "remitente": "PRIVILEGE TEAM",
      "ciudadorigen": "MEDELLÍN",
      "departamentoorigen": "ANTIOQUIA",
      "ceoporigen": "MEDELLÍN",
      "destinatario": "CAMILOPARRA",
      "direcciondestinatario": "CARRERA 13",
      "ciudaddestino": "BOGOTÁ, D.C.",
      "departamentodestino": "BOGOTA, D.C.",
      "ceopdestino": "BOGOTÁ",
      "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN",
      "complementonovedad": "DIRECCIÓN ERRADA",
      "descripcionnovedad": "Su mercancía se encuentra en centro de operación destino. Aún no ha sido entregada al destinatario ya que se encontró una diferencia entre los datos que acompañan la mercancía vs la guía. Por lo tanto, estamos en verificación de la información para continuar con el proceso de entrega. Lo invitamos a que se comunique a través de nuestros canales de contacto para confirmar los datos del destinatario. ",
      "comentariosnovedad": "CONFIRMAR DIRECCION PARA SU ENTREGA",
      "fechaplanteanovedad": "2024-05-02 09:27:00",
      "estadonovedad": "PLANTEADA",
      "imputabilidadnovedad": "CLIENTE",
      "atribuible": "",
      "tipogestion": "GESTIÓN",
      "correosolucion": "sacnovedadesmed@tcc.com.co",
      "telefonosolucion": "",
      "tiposolucion": "RE-OFRECIMIENTO,DEVOLUCION,CONTINUACION,OTRA",
      "limiteregistros": "1000",
      "observacionesremesa": "# 66-09 Apto 905"
    },
    {
      "idnovedad": "31102450892356643591737988798760005557",
      "codigonovedad": "103447964",
      "idtiponovedad": "947",
      "unidadenegocio": "MENSAJERIA",
      "numeroremesa": "609231842",
      "fecharemesa": "2024-04-30",
      "cuenta": "5872600",
      "remitente": "PRIVILEGE TEAM",
      "ciudadorigen": "MEDELLÍN",
      "departamentoorigen": "ANTIOQUIA",
      "ceoporigen": "MEDELLÍN",
      "destinatario": "JOVANNATAMAYO TAMAYO",
      "direcciondestinatario": "BARRIO :CUARTO DE LEGUA",
      "ciudaddestino": "SANTIAGO DE CALI",
      "departamentodestino": "VALLE DEL CAUCA",
      "ceopdestino": "CALI",
      "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN",
      "complementonovedad": "DIRECCIÓN ERRADA",
      "descripcionnovedad": "Su mercancía se encuentra en centro de operación destino. Aún no ha sido entregada al destinatario ya que se encontró una diferencia entre los datos que acompañan la mercancía vs la guía. Por lo tanto, estamos en verificación de la información para continuar con el proceso de entrega. Lo invitamos a que se comunique a través de nuestros canales de contacto para confirmar los datos del destinatario. ",
      "comentariosnovedad": "LAS UNIDADES PRESENTAN UNA DIRECCION ERRADA O INCOMPLETA, SE NECESITA MAS INFORMACION PARA SU ENTREGA, FAVOR VALIDAR DATOS NOMENCLATURA, BARRIO, CASA NUMERO DE APT Y CIUDAD DESTINO GRACIAS",
      "fechaplanteanovedad": "2024-05-01 12:49:25",
      "estadonovedad": "INFORMADA",
      "imputabilidadnovedad": "CLIENTE",
      "atribuible": "",
      "tipogestion": "GESTIÓN",
      "correosolucion": "sacnovedadesmed@tcc.com.co",
      "telefonosolucion": "",
      "tiposolucion": "RE-OFRECIMIENTO,DEVOLUCION,CONTINUACION,OTRA",
      "limiteregistros": "1000",
      "observacionesremesa": "Calle 1 #56-109 Seminario B Casa 45"
    }
  ],
  "codigoresultado": "0",
  "mensajeresultado": "Se ha realizado la consulta de forma satisfactoria con (3) registros."
}