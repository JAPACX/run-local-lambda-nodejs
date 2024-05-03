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

const getCarrierData = async ({idOrder, idCarrierStatusUpdate}) => {
    try {
        const query = `select carrierData from orderShipmentUpdateHistory where idOrder = ${idOrder} and idCarrierStatusUpdate = ${idCarrierStatusUpdate} order by createdAt desc limit 1`;

        const result = await db.query(query, {
            type: db.QueryTypes.SELECT
        });

        return result[0].carrierData;

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

        const response = await axios.post(
            URL_API,
            body,
            {headers}
        );

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default {updateCarrierData, getCarrierData, getOrdersWithIncidentsTCC};


