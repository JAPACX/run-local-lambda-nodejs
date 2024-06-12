import {simpleParser} from "mailparser";


const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

const parseEmail = async (rawEmail) => {
    try {
        const { subject, from, to, text, html, attachments } = await simpleParser(rawEmail);
        return {
            subject,
            from: from.text,
            to: to.text,
            text,
            html,
            attachments
        };
    } catch (error) {
        console.error('Error parsing email:', error);
    }
}


export default  {parseEmail, streamToString}
