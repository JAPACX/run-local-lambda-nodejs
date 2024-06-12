import dao from "./dao.mjs";
import dto from "./dto.mjs";

const getParsedEmail = async (event) => {
    try {
        const data = await dao.getS3File(event);
        const fileContent = await dto.streamToString(data.Body);
        return await dto.parseEmail(fileContent);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const getOrderData = async () => {
    try {
        return dao.getOrderData({carrierTrackingCode:609396334});
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const putItemToDynamoDB = async (data) => {
    try {
        return dao.putItemToDynamoDB(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const uploadAttachments = async ({attachments}) => {
    try {
        return dao.uploadAttachments({attachments});
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



export default {getParsedEmail, getOrderData, putItemToDynamoDB, uploadAttachments};



