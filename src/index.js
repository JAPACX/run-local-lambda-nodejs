import "dotenv/config";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import model from "./models.js";
import dto from "./dto.js";

const sqsClient = new SQSClient({ region: process.env.REGION });

export const handler = async (event) => {
  try {
    const [
      coordinadoraToUpdatedGuides,
      tccToUpdatedGuides,
      enviaToUpdatedGuides,
    ] = await Promise.all([
      model.findAllOrdersByCarrier(process.env.ID_COORDINADORA),
      model.findAllOrdersByCarrier(process.env.ID_TCC),
      model.findAllOrdersByCarrier(process.env.ID_ENVIA),
    ]);

    const sendPromisesCoordinadora = coordinadoraToUpdatedGuides.map(
      (guide) => {
        const serializedGuide = dto.dtoFindAllOrdersByCarrier(guide);
        const params = {
          QueueUrl: process.env.SQS_QUEUE_URL_COORDINADORA,
          MessageBody: JSON.stringify(serializedGuide),
        };

        const command = new SendMessageCommand(params);
        return sqsClient.send(command);
      }
    );

    const sendPromisesTcc = tccToUpdatedGuides.map((guide) => {
      const serializedGuide = dto.dtoFindAllOrdersByCarrier(guide);

      const params = {
        QueueUrl: process.env.SQS_QUEUE_URL_TCC,
        MessageBody: JSON.stringify(serializedGuide),
      };

      const command = new SendMessageCommand(params);
      return sqsClient.send(command);
    });

    const sendPromisesEnvia = enviaToUpdatedGuides.map((guide) => {
      const serializedGuide = dto.dtoFindAllOrdersByCarrier(guide);

      const params = {
        QueueUrl: process.env.SQS_QUEUE_URL_ENVIA,
        MessageBody: JSON.stringify(serializedGuide),
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
