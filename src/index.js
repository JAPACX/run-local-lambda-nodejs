import "dotenv/config";
import Order from "./model.js";

export const handler = async (event) => {
  try {
    const results = await Order.findAll({});

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
