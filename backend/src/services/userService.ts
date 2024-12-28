import { pool } from "../database";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

interface User {
  id: number;
  email: string;
  password: string;
}

export const createUser = async (
  email: string,
  password: string
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.execute("INSERT INTO users (email, password) VALUES (?, ?)", [
    email,
    hashedPassword,
  ]);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length > 0) {
    return rows[0] as User;
  }
  return null;
};

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
