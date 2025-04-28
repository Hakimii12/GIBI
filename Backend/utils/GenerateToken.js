import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const GenerateToken = (userId, role, res) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );
  
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 3 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === 'production'
  });
  
  return token;
};
