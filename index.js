import "dotenv/config";
import express from "express";
<<<<<<< HEAD
import { handler } from "./src/index.js";
=======
import {promises as fs} from "fs";
import {handler} from "./src/index.mjs";
>>>>>>> MasterShop-ProcessUpdateFromSQS-Tcc

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
<<<<<<< HEAD
  handler({}, {})
    .then((response) => {
      res.json(JSON.parse(response.body));
    })
    .catch((err) => {
      console.error("Error executing Lambda without an event:", err);
      res.status(500).send("Error processing request without event");
    });
});


=======
    handler(event, {})
        .then((response) => {
            res.json(JSON.parse(response.body));
        })
        .catch((err) => {
            console.error("Error executing Lambda without an event:", err);
            res.status(500).send("Error processing request without event");
        });
});

app.use("/", async (req, res) => {
    res.status(404).send("Not found");
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


const event = {}
event.detail = {
    "ordersWithIncidents": [
        {
            "carrierData": {
                "numeroremesa": "609231861",
                "codigonovedad": "103452226",
                "fechanovedad": "2024-05-02T10:30:00-05:00",
                "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN - DIRECCIÓN ERRADA",
                "estadonovedad": "Informada",
                "listaestados": [
                    {
                        "codigo": "500",
                        "descripcion": "Envío en Instalaciones TCC origen",
                        "fecha": "2024-04-30T19:25:18-05:00"
                    },
                    {
                        "codigo": "500",
                        "descripcion": "Envío Preparado para Envio a Destino",
                        "fecha": "2024-04-30T21:51:44-05:00"
                    },
                    {
                        "codigo": "1000",
                        "descripcion": "Envío en tránsito a Instalaciones TCC destino Con Novedad",
                        "fecha": "2024-04-30T21:51:44-05:00"
                    }
                ],
                "listanovedades": [
                    {
                        "codigonovedad": "947",
                        "fechanovedad": "2024-05-02T10:30:00-05:00",
                        "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN - DIRECCIÓN ERRADA",
                        "estadonovedad": "Informada"
                    }
                ]
            },
            "guideId": "609231861",
            "idCarrierStatusUpdate": 204,
            "idShipmentUpdate": 263,
            "error": null,
            "idOrder": 1591,
            "idUser": 66156,
            "idBusiness": 66145
        },
        {
            "carrierData": {
                "numeroremesa": "609227329",
                "codigonovedad": "103451770",
                "fechanovedad": "2024-05-02T09:27:00-05:00",
                "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN - DIRECCIÓN ERRADA",
                "estadonovedad": "Informada",
                "listaestados": [
                    {
                        "codigo": "500",
                        "descripcion": "Envío en Instalaciones TCC origen",
                        "fecha": "2024-04-30T19:23:37-05:00"
                    },
                    {
                        "codigo": "500",
                        "descripcion": "Envío Preparado para Envio a Destino",
                        "fecha": "2024-04-30T21:23:46-05:00"
                    },
                    {
                        "codigo": "1000",
                        "descripcion": "Envío en tránsito a Instalaciones TCC destino",
                        "fecha": "2024-04-30T21:23:46-05:00"
                    },
                    {
                        "codigo": "2000",
                        "descripcion": "Envío en proceso de entrega Con Novedad",
                        "fecha": "2024-05-02T08:45:07-05:00"
                    }
                ],
                "listanovedades": [
                    {
                        "codigonovedad": "947",
                        "fechanovedad": "2024-05-02T09:27:00-05:00",
                        "novedad": "MERCANCÍA NO SALE A DISTRIBUCIÓN - DIRECCIÓN ERRADA",
                        "estadonovedad": "Informada"
                    }
                ]
            },
            "guideId": "609227329",
            "idCarrierStatusUpdate": 204,
            "idShipmentUpdate": 263,
            "error": null,
            "idOrder": 1724,
            "idUser": 66156,
            "idBusiness": 66145
        }
    ]
}
>>>>>>> MasterShop-ProcessUpdateFromSQS-Tcc
