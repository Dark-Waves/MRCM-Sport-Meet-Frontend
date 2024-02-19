import CryptoJS from "crypto-js";
import { config } from "../../config";

const key: string = config.encryptKey; // 32-byte key
const iv = CryptoJS.lib.WordArray.random(16); // 16-byte IV (Initialization Vector)
const encryptSecure: boolean = config.encrypt;

interface EncryptedData {
  _v: string;
  d: string;
}

export function encrypt(
  data: string | object | any[]
): EncryptedData | string | object | any[] {
  if (!encryptSecure) return data;
  let text: string;
  if (typeof data === "string") {
    text = data;
  } else {
    text = JSON.stringify(data);
  }
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return {
    _v: iv.toString(),
    d: encrypted.toString(),
  };
}

export function decrypt(data: EncryptedData): string | object | any[] | any {
  if (!encryptSecure) return data;
  const decrypted = CryptoJS.AES.decrypt(data.d, key, {
    iv: CryptoJS.enc.Hex.parse(data._v),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decryptedText);
  } catch (error) {
    return decryptedText;
  }
}
