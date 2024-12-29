import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getWeatherData = async (): Promise<any[]> => {
  const response = await api.get("/weather");
  return response.data;
};

export const addWeatherData = async (data: {
  city: string;
  country: string;
  temperature: number;
  description: string;
}): Promise<void> => {
  const token = localStorage.getItem("authToken");
  await axios.post("http://localhost:3000/weather", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
