import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddWeatherModal from "./AddWeatherModal";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  timestamp: string;
}

const fetchWeatherData = async (): Promise<WeatherData[]> => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get("http://localhost:3000/weather", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

const WeatherTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeatherData,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]); 

  const columns: ColumnDef<WeatherData>[] = [
    {
      header: "Ciudad",
      accessorKey: "city",
    },
    {
      header: "País",
      accessorKey: "country",
    },
    {
      header: "Temperatura",
      accessorKey: "temperature",
      cell: ({ getValue }) => `${(getValue<number>() || 0).toFixed(2)}°C`,
    },
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Fecha",
      accessorKey: "timestamp",
      cell: ({ getValue }) =>
        new Date(getValue<string>()).toLocaleString("es-CL", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <div className="text-center mt-10">Cargando...</div>;
  if (error instanceof Error)
    return <div className="text-center mt-10">Error: {error.message}</div>;

  return (
    <div className="p-12 bg-slate-400 dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-black dark:bg-black dark:text-white">
        Datos del Clima
      </h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded my-2"
      >
        Agregar Registro
      </button>
      <input
        type="text"
        placeholder="Filtrar datos..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <table className="min-w-full bg-white border border-gray-300 text-black">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-4 py-2 text-left bg-gray-100 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                  {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <AddWeatherModal
          onClose={() => setIsModalOpen(false)}
          onAdd={refetch}
        />
      )}
    </div>
  );
};

export default WeatherTable;
