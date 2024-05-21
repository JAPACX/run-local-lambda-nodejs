import "dotenv/config";
import express from "express";
import {handler} from "./src/index.mjs";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
    try {
        const response = await handler(apiGatewayEvent, {});
        res.setHeader('Content-Type', response.headers["Content-Type"]);
        res.setHeader('Content-Disposition', response.headers["Content-Disposition"]);

        const pdfBuffer = Buffer.from(response.body, 'base64');

        res.send(pdfBuffer);
    } catch (err) {
        console.error("Error executing Lambda without an event:", err);
        res.status(500).send("Error processing request without event");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const eventBridgeEvent = {
    version: '0',
    id: '3fe2d514-f37e-f098-5ca7-59e9ed4d90a3',
    'detail-type': 'MANIFEST-DOWNLOAD',
    source: 'MASTERSHOP-DOCUMENTS',
    account: '045891372648',
    time: '2024-05-21T18:25:50Z',
    region: 'us-east-1',
    resources: [],
    detail: {
        userId: '66156',
        ordersIds: [
            '3403', '3401'
        ],
        environment: 'prod'
    }
}

const apiGatewayEvent = {
    version: '2.0',
    routeKey: 'POST /api/b2c/documents/templates/manifest',
    rawPath: '/prod/api/b2c/documents/templates/manifest',
    rawQueryString: '',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'es-AR,es-419;q=0.9,es;q=0.8',
        authorization: 'Bearer eyJraWQiOiJnYmNYR09MWVJpV1ZIT2MzS0FEVzVhUVpPRVwvY012UjJVTHhNclhzQWtVbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MmY1NDAzNy1lZTg4LTQ5ZDAtODY4Yy1iM2I5ZGIyMWRkMjYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9EWmtUa3hRTUUiLCJjbGllbnRfaWQiOiIxZWZ0bHQ5ZWQ3NTNrZ2RhZDJvZmd2OWExMSIsIm9yaWdpbl9qdGkiOiJhNTRhZDI1My03ZGQxLTQxNzQtOThkZS0zMTRkYWI5ZjEwNzUiLCJldmVudF9pZCI6ImZjMjNjYzhkLTM0MDYtNDU2Mi04N2ZhLTI4OTlhNjUyYWI1YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MTYyMTU2NzUsImV4cCI6MTcxNjI0NDQ3NSwiaWF0IjoxNzE2MjE1Njc1LCJqdGkiOiJmYjRkZmQxMS1mZWQ5LTQ5ODktODY1MC05OTI4NDU1OTA3MDUiLCJ1c2VybmFtZSI6IjUyZjU0MDM3LWVlODgtNDlkMC04NjhjLWIzYjlkYjIxZGQyNiJ9.sEsXHhcIwGtUqDjXZ6BiRhEoH0xIOXhZ0PqUpIYmGHETP0Rt-zchPR1xJyeDQuwaQWeW4FTKzEdSn2UWP0MbfkCQ7z3DrgTwAS3Zo69pEdwJ5P2vz47eXU2qCh8SHwZTanz3REGm4Af13tbZiOWF3ki9z8XFvRI5w6euS-us7XHg47lnPKuVMEVKDvgzd00PsQRQCdKPfeBkHZ_p-4u7HCzPSUDvD5HtrRb25y0vR8rTY2wPJOwbghSIAyduPdLqnIanz8jbZ9KqCbepm8R6jmao2EbWTYTK1aMQaqY_TSixbGkPF0l-RFIp3vL0xVKfwL70GDkJFPrWkkJPXD9UPQ',
        'content-length': '43',
        'content-type': 'application/json',
        host: 'l7tmtzztq1.execute-api.us-east-1.amazonaws.com',
        origin: 'https://app.mastershop.com',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'x-amzn-trace-id': 'Root=1-664b67d4-2202b69a253ea7cd020c8c76',
        'x-auth-id': 'eyJraWQiOiJyU2lwUHpNTStjVTA0ZXltYTl3YXFwRENOK1VYQVh5R214T3RNNlRMUTBrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1MmY1NDAzNy1lZTg4LTQ5ZDAtODY4Yy1iM2I5ZGIyMWRkMjYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfRFprVGt4UU1FIiwiY29nbml0bzp1c2VybmFtZSI6IjUyZjU0MDM3LWVlODgtNDlkMC04NjhjLWIzYjlkYjIxZGQyNiIsIm9yaWdpbl9qdGkiOiJhNTRhZDI1My03ZGQxLTQxNzQtOThkZS0zMTRkYWI5ZjEwNzUiLCJhdWQiOiIxZWZ0bHQ5ZWQ3NTNrZ2RhZDJvZmd2OWExMSIsImV2ZW50X2lkIjoiZmMyM2NjOGQtMzQwNi00NTYyLTg3ZmEtMjg5OWE2NTJhYjVhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTYyMTU2NzUsIm5hbWUiOiJKZWlzc29uIFBlcmV6IiwiY3VzdG9tOmlkVXNlck1hc3RlcnNob3AiOiI2NjE1MCIsImV4cCI6MTcxNjMwMjA3NSwiY3VzdG9tOnJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcxNjIxNTY3NSwianRpIjoiNGI1OTk2OGEtY2UwMi00YTEzLWJiNDItOTA2NTI3NGU0MjlmIiwiZW1haWwiOiJkcm9wc2hpcHBpbmdAZXVmZm9yaWEuY28ifQ.eqNKh7MDoygf9V-TheQ5gwH8zdjz85_pOV3ejXxZNUjKAfTlzqumiPPbL77Vsw1Uke4dLQQ1e4JmKv-9vorHdQYkqJ5jpUHGUzVs6pt-SRf6MkYFOt-i6BbTIbNhtAVJdBbztabjK8Nat_LcWP3kFd83W0xDGtdzMCP-7rsgHI36NgG4BkQ4q--x9xY58HgXbbvmz0gosV05qB5NAiZKiJQy-2gzpuh1eBZ4m6D_Hf1zWHecM3LXJlwEPqF4Oep2CgFBM6vqUXSonM64PibhAUN3GV2GGkqjnMWs-lf_mgE55BcvmvrVsE6biJ8TIHnEWHJv1Vu8ZsVkOA1phv0UQg',
        'x-forwarded-for': '190.28.103.229',
        'x-forwarded-port': '443',
        'x-forwarded-proto': 'https'
    },
    requestContext: {
        accountId: '045891372648',
        apiId: 'l7tmtzztq1',
        authorizer: { jwt: [Object] },
        domainName: 'l7tmtzztq1.execute-api.us-east-1.amazonaws.com',
        domainPrefix: 'l7tmtzztq1',
        http: {
            method: 'POST',
            path: '/prod/api/b2c/documents/templates/manifest',
            protocol: 'HTTP/1.1',
            sourceIp: '190.28.103.229',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        },
        requestId: 'YE0pNjsdIAMEJKQ=',
        routeKey: 'POST /api/b2c/documents/templates/manifest',
        stage: 'prod',
        time: '20/May/2024:15:10:12 +0000',
        timeEpoch: 1716217812243
    },
    stageVariables: {
        Endpoint: 'mastershop-bk-lb-204791640.us-east-1.elb.amazonaws.com',
        EndpointLogistics: 'mastershop-logistics-bk-lb-1660909540.us-east-1.elb.amazonaws.com',
        VerifyParam: 'mastershop-prod-apigateway-to-lb-verify-19911210',
        VerifyParamLogistics: 'mastershop-logistics-prod-apigateway-to-lb-verify-19911210'
    },
    body: '{"ordersIds":["3270","3188","3185","3184"]}',
    isBase64Encoded: false
}


