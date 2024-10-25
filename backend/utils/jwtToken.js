import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function jwtGenerator(user_id, type) {
  const payload = {
    user: {
      user_id,
      type
    }
  };

  return jwt.sign(payload, process.env.JWTSECRET, { expiresIn: "1h" });
}

export function jwtDecoder(token) {
  return jwt.verify(token, process.env.JWTSECRET);
}
