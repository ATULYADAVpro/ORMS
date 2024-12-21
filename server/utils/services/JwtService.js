import jwt from "jsonwebtoken";
import { JWT_SECRECT } from "../configs/index.js";

class JwtService {
    // Method to sign a token with expiration time and optional additional options
    static sign(payload, expiry = '60m', secret = JWT_SECRECT, options = {}) {
        return jwt.sign(payload, secret, { expiresIn: expiry, ...options });
    }

    // Method to verify a token
    static verify(token, secret = JWT_SECRECT) {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            throw new Error("Token is invalid or expired");
        }
    }
}

export default JwtService;
