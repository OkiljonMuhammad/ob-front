import { jwtDecode } from 'jwt-decode';
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (err) {
    console.error('Error decoding token:', err);
    return true;
  }
};

export const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptData = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedText), SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
