import express, { Request } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { fetchAllWeatherData } from "../services/weatherService";
import { pool } from "../database";

const router = express.Router();

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

router.post("/", authenticateToken, async (req: Request, res: any) => {
  const { city, country, temperature, description } = req.body;

  if (!city || !country || !temperature || !description) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    // Busca el city_id correspondiente
    const [cityRows]: any = await pool.execute(
      "SELECT id FROM cities WHERE name = ? AND country = ?",
      [city, country]
    );

    if (cityRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Ciudad no encontrada en la base de datos." });
    }

    const city_id = cityRows[0].id;

    // Inserta el nuevo registro en weather_data
    await pool.execute(
      "INSERT INTO weather_data (city_id, temperature, description, timestamp) VALUES (?, ?, ?, NOW())",
      [city_id, temperature, description]
    );

    res.status(201).json({ message: "Registro agregado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el registro.", error });
  }
});


export default router;
