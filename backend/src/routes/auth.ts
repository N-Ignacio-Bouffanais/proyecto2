import express from "express";
import {
  createUser,
  findUserByEmail,
  validatePassword,
} from "../services/userService";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req:any, res:any) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email y contrasena requeridas" });

  try {
    await createUser(email, password);
    res.status(201).json({ message: "Usuario registrado con exito" });
  } catch (err) {
    res.status(500).json({ message: "Error registrando usuario", error: err });
  }
});

router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email y contrasena requeridas." });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Contrasena incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error ingresando", error: err });
  }
});

export default router;
