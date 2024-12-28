import axios from "axios";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const cities = ["Santiago", "Buenos Aires", "Lima", "Bogota", "Caracas"]; // Agrega más ciudades si es necesario

const populateDatabase = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "db1",
  });

  for (const city of cities) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: { q: city, appid: API_KEY, units: "metric" },
        }
      );

      const cityName = response.data.name;
      const country = response.data.sys.country;
      const temperature = response.data.main.temp;
      const description = response.data.weather[0].description;

      // Insert city
      const [cityResult] = await db.execute(
        `INSERT INTO cities (name, country) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [cityName, country]
      );

      const cityId = (cityResult as any).insertId;

      // Insert weather data
      await db.execute(
        `INSERT INTO weather_data (city_id, temperature, description, timestamp) VALUES (?, ?, ?, NOW())`,
        [cityId, temperature, description]
      );

      console.log(`Inserted weather data for city: ${cityName}`);
    } catch (error) {
      console.error(`Error fetching data for city ${city}:`, error);
    }
  }

  await db.end();
};

populateDatabase();
