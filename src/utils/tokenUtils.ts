import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
    exp: number;
    iat: number;
    [key: string]: any;
}

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Check if token is expired
 * @param token JWT token string
 * @param bufferSeconds Buffer time in seconds before actual expiration (default: 60s)
 * @returns true if token is expired or will expire soon
 */
export const isTokenExpired = (token: string | undefined, bufferSeconds: number = 60): boolean => {
    if (!token) return true;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    const expirationTime = decoded.exp;
    
    // Token is expired if current time >= expiration time - buffer
    return currentTime >= (expirationTime - bufferSeconds);
};

/**
 * Get token expiration time in milliseconds
 */
export const getTokenExpirationTime = (token: string | undefined): number | null => {
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return decoded.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expires in milliseconds
 */
export const getTimeUntilExpiration = (token: string | undefined): number | null => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return null;
    
    return Math.max(0, expirationTime - Date.now());
};

