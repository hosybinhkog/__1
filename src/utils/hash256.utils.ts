import * as crypto from "node:crypto";

export function hashSHA256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
}

export function hashPassword(password: string):string {
    return hashSHA256(password + process.env.SALT);
}