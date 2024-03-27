import "dotenv/config";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import Order from "./db/models/Order.js";
import OrderStatusLog from "./db/models/OrderStatusLog.js";
import { Op, Sequelize } from "sequelize";

const sqsClient = new SQSClient({ region: process.env.REGION });

const findAllOrdersByCarrier = async (idCarrier) => {
  return Order.findAll({
    where: {
      idCarrier: idCarrier,
      carrierTrackingCode: {
        [Op.ne]: "",
        [Op.not]: null,
      },
      [Op.or]: [
        { idStatus: { [Op.in]: [3, 4, 6, 7] } },
        {
          idOrder: {
            [Op.in]: OrderStatusLog.findAll({
              attributes: ["idOrder"],
              where: {
                idStatus: [8, 10],
                createdAt: {
                  [Op.gt]: Sequelize.literal("DATE_SUB(NOW(), INTERVAL 2 DAY)"),
                },
              },
              raw: true,
            }),
          },
        },
      ],
    },
    limit: 10,
    raw: true,
  });
};

export const handler = async (event) => {
  try {
    const [
      coordinadoraToUpdatedGuides,
      tccToUpdatedGuides,
      enviaToUpdatedGuides,
    ] = await Promise.all([
      findAllOrdersByCarrier(process.env.ID_COORDINADORA),
      findAllOrdersByCarrier(process.env.ID_TCC),
      findAllOrdersByCarrier(process.env.ID_ENVIA),
    ]);

    const sendPromisesCoordinadora = coordinadoraToUpdatedGuides.map(
      (guide) => {
        const params = {
          QueueUrl: process.env.SQS_QUEUE_URL_COORDINADORA,
          MessageBody: JSON.stringify(guide),
        };

        const command = new SendMessageCommand(params);
        return sqsClient.send(command);
      }
    );

    const sendPromisesTcc = tccToUpdatedGuides.map((guide) => {
      const params = {
        QueueUrl: process.env.SQS_QUEUE_URL_TCC,
        MessageBody: JSON.stringify(guide),
      };

      const command = new SendMessageCommand(params);
      return sqsClient.send(command);
    });

    const sendPromisesEnvia = enviaToUpdatedGuides.map((guide) => {
      const params = {
        QueueUrl: process.env.SQS_QUEUE_URL_ENVIA,
        MessageBody: JSON.stringify(guide),
      };

      const command = new SendMessageCommand(params);
      return sqsClient.send(command);
    });

    await Promise.all(
      sendPromisesCoordinadora,
      sendPromisesTcc,
      sendPromisesEnvia
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success, all messages sent to SQS",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to execute query or send messages to SQS",
        error: error.message,
      }),
    };
  }
};
