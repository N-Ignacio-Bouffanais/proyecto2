import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Acceso denegado, se necesita un token" });
    return; 
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token Invalido" });
    return; 
  }
};
