"use client";
import React, { useState } from "react";

import { BacktestData, BacktestDataInput } from "../types";
import DataInput from "./DataInput";
import ResultTable from "./ResultTable";

const BacktestTool: React.FC = () => {
  const [backtestData, setBacktestData] = useState<BacktestData[]>([]);

  const handleDataSubmit = (data: BacktestDataInput) => {
    const newEntry: BacktestData = { ...data, id: Date.now() };
    setBacktestData((prev) => [...prev, newEntry]);
  };

  const handleRemoveItem = (id: number) => {
    setBacktestData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Backtest Tool</h1>
      <DataInput onSubmit={handleDataSubmit} />
      {backtestData.length > 0 && (
        <ResultTable data={backtestData} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
};

export default BacktestTool;
