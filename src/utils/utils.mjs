import t from "./templates.mjs";

const extractShipmentCode = (subject, text) => {
    const regex = /\b4\d{10}\b/g;
    const subjectMatch = subject.match(regex);
    const textMatch = text.match(regex);

    if (subjectMatch) {
        return subjectMatch[0];
    } else if (textMatch) {
        return textMatch[0];
    }

    return null;
};

const normalizeText = (text) => {
    return text.normalize("NFD")  // Normalize characters to NFD, splitting the character and the diacritic mark
        .replace(/[\u0300-\u036f]/g, "")  // Remove all diacritic marks
        .replace(/\s+/g, ' ')  // Replace all whitespace with single spaces
        .trim()  // Trim the resulting string
        .toLowerCase();  // Convert to lower case
};

const validateEmailContent = (subject, text) => {
    let result = { isValid: false, code: null, shipmentCode: null };
    const normalizedSubject = normalizeText(subject);

    for (const template of t.templates) {
        if (template.subjectKeywords.every(keyword => normalizedSubject.includes(normalizeText(keyword)))) {
            result.isValid = true;
            result.code = template.code;
            result.shipmentCode = extractShipmentCode(subject, text);
            return result;
        }
    }

    result.shipmentCode = extractShipmentCode(subject, text);
    return result;
};

export default { validateEmailContent };
