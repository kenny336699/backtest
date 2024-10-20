"use client";
import React, { useState } from "react";

import { BacktestData } from "../types";
import DataInput from "./DataInput";
import ResultTable from "./ResultTable";

const BacktestTool: React.FC = () => {
  const [backtestData, setBacktestData] = useState<BacktestData[]>([]);

  const handleDataSubmit = (data: BacktestData) => {
    setBacktestData((prev) => [...prev, data]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Backtest Tool</h1>
      <DataInput onSubmit={handleDataSubmit} />
      {backtestData.length > 0 && <ResultTable data={backtestData} />}
    </div>
  );
};

export default BacktestTool;
