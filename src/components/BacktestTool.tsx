"use client";
import React, { useState, useEffect } from "react";
import { BacktestData, BacktestDataInput } from "../types";
import DataInput from "./DataInput";
import ResultTable from "./ResultTable";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import loading spinner

const BacktestTool: React.FC = () => {
  const [backtestData, setBacktestData] = useState<BacktestData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedData = localStorage.getItem("backtestData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setBacktestData(parsedData);
      }
    } catch (error) {
      setError("Failed to load saved data");
      console.error("Error parsing stored data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("backtestData", JSON.stringify(backtestData));
      } catch (error) {
        console.error("Error saving data:", error);
        setError("Failed to save data");
      }
    }
  }, [backtestData, isClient]);

  const handleDataSubmit = (data: BacktestDataInput) => {
    try {
      const newEntry: BacktestData = { 
        ...data, 
        id: Date.now(),
      
      };
      setBacktestData((prev) => [...prev, newEntry]);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to add new entry");
      console.error("Error adding entry:", error);
    }
  };

  const handleRemoveItem = (id: number) => {
    try {
      setBacktestData((prev) => prev.filter((item) => item.id !== id));
      setError(null);
    } catch (error) {
      setError("Failed to remove item");
      console.error("Error removing item:", error);
    }
  };

  const handleClearAll = () => {
    try {
      setBacktestData([]);
      localStorage.removeItem("backtestData");
      setError(null);
    } catch (error) {
      setError("Failed to clear data");
      console.error("Error clearing data:", error);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error}
        <Button onClick={() => setError(null)} className="ml-4">
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Backtest Tool</h1>
      <DataInput onSubmit={handleDataSubmit} />
      {backtestData.length > 0 && (
        <div className="mt-8">
          <ResultTable data={backtestData} onRemoveItem={handleRemoveItem} />
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="mr-4"
            >
              Clear All Data
            </Button>
            <div className="text-sm text-gray-500">
              Total entries: {backtestData.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestTool;
