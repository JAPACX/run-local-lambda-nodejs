import {jwtDecode} from "jwt-decode";

const cleanText = (text) => {
    text = String(text);

    const allowedChars = /[a-zA-Z0-9\-_()"'\.\s]/g;

    const result = text.match(allowedChars);
    return result ? result.join('') : '';
};

const decodeJWTToken = (token) => {
    const decodedToken = jwtDecode(token);
    return {
        token,
        token_use: decodedToken.token_use,
        auth_time: decodedToken.auth_time,
        name: decodedToken.name,
        idUser: decodedToken['custom:idUserMastershop'],
        exp: decodedToken.exp,
        role: decodedToken['custom:role'],
    };
};

const getEventDetails = (event) =>{
    let origin, environment, body, userId, ordersIds ;

    if (event.body) body = JSON.parse(event.body);

    if (body?.ordersIds && body?.ordersIds.length > 0) {

        let stage = event.requestContext.stage;
        stage === 'qa' || stage === 'prod' ? stage = 'prod' : stage = 'dev';

        origin = 'apiGateway';
        environment = stage;
        userId = decodeJWTToken(event.headers["x-auth-id"]).idUser;
        ordersIds = body.ordersIds;
    } else {
        origin = 'EventBridge';
        userId = event.detail.userId;
        ordersIds = event.detail.ordersIds;
        environment = event.detail.environment || 'prod';
    }

    return { origin, environment, userId, ordersIds };
};


export default {cleanText, decodeJWTToken, getEventDetails};