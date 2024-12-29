import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getWeatherData = async (): Promise<any[]> => {
  const response = await api.get("/weather");
  return response.data;
};

