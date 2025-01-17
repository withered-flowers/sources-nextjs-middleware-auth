import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const salt = randomBytes(16).toString("hex");

export const generateHash = (plaintext: string) => {
	const key = scryptSync(plaintext, salt, 32);

	return `${salt}:${key.toString("hex")}`;
};

export const verifyHash = (plaintext: string, hash: string) => {
	const [salt, key] = hash.split(":");
	const keyBuffer = scryptSync(plaintext, salt, 32);

	return timingSafeEqual(keyBuffer, Buffer.from(key, "hex"));
};
