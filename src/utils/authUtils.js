import { jwtDecode } from 'jwt-decode';

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