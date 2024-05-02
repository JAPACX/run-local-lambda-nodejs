import model from "./model.mjs";

export const handler = async (event, context) => {

    const getOrdersWithIncidentsTCC =  await model.getOrdersWithIncidentsTCC();

    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
};




