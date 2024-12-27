import axios from "axios";

const API_KEY = "your_api_key";
const cities = ["Santiago", "Buenos Aires", "Lima", "Bogota", "Caracas"];

const fetchForecasts = async () => {
  const results = [];
  for (const city of cities) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: { q: city, appid: API_KEY, units: "metric" },
      }
    );
    results.push(...response.data.list); 
  }
  return results.slice(0, 50); // Limitar a 50 registros
};

fetchForecasts().then((data) => console.log(data));
