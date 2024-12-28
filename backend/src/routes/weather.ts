import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { fetchAllWeatherData } from "../services/weatherService";

const router = express.Router();

// Ruta protegida para obtener los datos del clima
router.get("/", authenticateToken, async (req: Request, res: any) => {
  try {
    const weatherData = await fetchAllWeatherData();
    return res
      .status(200)
      .json({ message: "Datos del clima protegidos.", data: weatherData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching weather data.", error: err });
  }
});

export default router;
