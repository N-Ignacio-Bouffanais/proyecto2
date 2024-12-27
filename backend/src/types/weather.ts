interface WeatherForecast {
  dt: number; // Timestamp
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string; // Fecha y hora
}

interface ForecastResponse {
  list: WeatherForecast[];
}
