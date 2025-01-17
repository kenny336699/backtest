"use client";
import React, { useState, useEffect } from "react";
import { BacktestData, BacktestDataInput } from "../types";
import DataInput from "./DataInput";
import ResultTable from "./ResultTable";
import { Button } from "@/components/ui/button";

const BacktestTool: React.FC = () => {
  const [backtestData, setBacktestData] = useState<BacktestData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem("backtestData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBacktestData(parsedData);
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("backtestData", JSON.stringify(backtestData));
    }
  }, [backtestData, isClient]);

  const handleDataSubmit = (data: BacktestDataInput) => {
    const newEntry: BacktestData = { ...data, id: Date.now() };
    setBacktestData((prev) => [...prev, newEntry]);
  };

  const handleRemoveItem = (id: number) => {
    setBacktestData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setBacktestData([]);
    localStorage.removeItem("backtestData");
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Backtest Tool</h1>
      <DataInput onSubmit={handleDataSubmit} />
      {backtestData.length > 0 && (
        <>
          <ResultTable data={backtestData} onRemoveItem={handleRemoveItem} />
          <Button
            onClick={handleClearAll}
            className="mt-4"
            variant="destructive"
          >
            Clear All Data
          </Button>
        </>
      )}
    </div>
  );
};

export default BacktestTool;
