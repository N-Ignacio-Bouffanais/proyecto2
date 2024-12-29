import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "./api/weather";

const App = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather"],
    queryFn: getWeatherData, 
  });

  if (isLoading) return <div className="text-center mt-10">Cargando...</div>;
  if (error instanceof Error)
    return <div className="text-center mt-10">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Data</h1>
      <ul>
        {data?.map((item: any) => (
          <li key={item.id} className="mb-2">
            <div>
              <strong>{item.city.name}</strong>: {item.temperature}°C (
              {item.description})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
