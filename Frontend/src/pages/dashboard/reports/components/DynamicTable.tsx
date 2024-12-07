// src/components/DynamicTable.tsx
import { columnConfig } from "@/config/ColumnConfig";
import React, { useEffect, useState } from "react";

interface DynamicTableProps {
  reportType: string;
  filters: Record<string, any>;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ reportType, filters }) => {
  const [data, setData] = useState<any[]>([]);
  const columns = columnConfig[reportType] || [];

  useEffect(() => {
    // Simulate fetching data based on reportType and filters
    const fetchData = async () => {
      // Replace this with an actual API call
      const mockData = [];
      setData(mockData);
    };

    fetchData();
  }, [reportType, filters]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DynamicTable;
