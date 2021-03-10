import * as crypto from 'crypto';

export class Encryption {
    static encrypt(text) {
        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            Buffer.from(process.env.PASSWORD_CRYPTO_SECRET, 'hex'),
            Buffer.from(process.env.PASSWORD_IV_SECRET, 'hex')
        );
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: process.env.PASSWORD_IV_SECRET,
            encryptedData: encrypted.toString('hex'),
        };
    }

    static decrypt(text) {
        const iv = Buffer.from(text.iv, 'hex');
        const encryptedText = Buffer.from(text.encryptedData, 'hex');
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(process.env.PASSWORD_CRYPTO_SECRET, 'hex'),
            iv
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}