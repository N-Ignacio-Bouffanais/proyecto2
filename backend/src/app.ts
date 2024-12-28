import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { fetchAllWeatherData } from "./services/weatherService";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para obtener todos los datos de la tabla de MySQL
app.get("/weather", async (req: Request, res: Response) => {
  try {
    const weatherData = await fetchAllWeatherData();
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
