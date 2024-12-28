import mysql from "mysql2/promise";

export const fetchAllWeatherData = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "weather_db",
  });

  const [rows] = await db.execute(
    `SELECT cities.name AS city, cities.country, weather_data.temperature, weather_data.description, weather_data.timestamp
         FROM weather_data
         JOIN cities ON weather_data.city_id = cities.id`
  );

  await db.end();
  return rows;
};
