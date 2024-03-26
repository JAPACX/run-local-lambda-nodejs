import "dotenv/config";
console.log("aca pasa", process.env.DB_USER, process.env.DB_PASSWORD);
import db from "./db.js";

export const handler = async (event) => {
  try {
    const [results, metadata] = await db.query("SELECT * FROM `order`;", {
      type: db.QueryTypes.SELECT,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "success from lambda",
        data: results,
      }),
    };
  } catch (error) {
    console.error("Error executing query:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to execute query",
        error: error.message,
      }),
    };
  }
};
