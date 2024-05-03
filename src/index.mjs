
export const handler = async (event, context) => {

    try {
        return {
            statusCode: 200,
            body: JSON.stringify('Ejecución exitosa'),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(`Error al procesar el evento: ${err}`),
        };
    }
};
