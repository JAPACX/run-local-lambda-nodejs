import "dotenv/config";

export const handler = async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "success from lambda",
        data: "data",
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
