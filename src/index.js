import "dotenv/config";
import Order from "./db/models/Order.js";
import OrderStatusLog from "./db/models/OrderStatusLog.js";
import { Op, Sequelize } from "sequelize";

export const handler = async (event) => {
  try {
    const results = await Order.findAll({
      where: {
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
                    [Op.gt]: Sequelize.literal(
                      "DATE_SUB(NOW(), INTERVAL 2 DAY)"
                    ),
                  },
                },
              }),
            },
          },
        ],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success from lambda",
        data: results,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to execute query",
        error: error.message,
      }),
    };
  }
};
