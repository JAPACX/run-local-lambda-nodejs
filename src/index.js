import "dotenv/config";
import { Op } from "sequelize";
import Order from "./db/model.js";

export const handler = async (event) => {
  try {
    const results = await Order.findAll({
      where: {
        idStatus: {
          [Op.notIn]: [8, 9, 11],
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "success from lambda",
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
