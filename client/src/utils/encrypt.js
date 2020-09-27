import CryptoJS from 'crypto-js';

export function encrypt(data, encKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encKey).toString();
}

export function decrypt(data, encKey) {
    const bytes = CryptoJS.AES.decrypt(data, encKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}