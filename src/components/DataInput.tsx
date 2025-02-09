import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BacktestDataInput } from "../types";
import { DateTimeInput } from "./input/DateTimeInput";
import { CheckboxGroupInput } from "./input/CheckboxGroupInput";
import { FeelingInput } from "./input/FeelingInput";
import { NumberInput } from "./input/NumberInput";
import { SymbolInput } from "./input/SymbolInput";



interface DataInputProps {
  onSubmit: (data: BacktestDataInput) => void;
}

const predefinedSymbols = ["TSLA", "NVDA", "APPLE", "SPOTCRUDE"];

const patterns = [
  { id: "2", name: "PBB" },
  { id: "1", name: "KL PBB" },
  { id: "3", name: "3C" },
  { id: "4", name: "CWH" },
  { id: "5", name: "CHEAT" },
  { id: "6", name: "LC" },
  { id: "7", name: "CUP" },
  { id: "8", name: "FLAG" },
];

const supports = [
  { id: "1", name: "20ma" },
  { id: "2", name: "200ma" },
  { id: "3", name: "bullbearzone" },
  { id: "4", name: "VWAP" },
  { id: "5", name: "大戶" },
  { id: "6", name: "Day low or high" },
  { id: "7", name: "藍線" },
  { id: "8", name: "KL" },
];

const additionals = [
  { id: "1", name: "慣性" },
  { id: "2", name: "洗盤" },
  { id: "3", name: "開市" },
  { id: "4", name: "R >= 1" },
];

const DataInput: React.FC<DataInputProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BacktestDataInput>({
    date: "",
    time: "21:30",
    symbol: "",
    pattern: "",
    support: "",
    additional: "",
    r: 0,
    feeling: "",
    stopLossValue: 0,
  });

  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "r" || name === "stopLossValue") 
        ? (value === "" || value === null ? 0 : parseFloat(value))
        : value
    }));
  };

  const handleSymbolCheck = (symbol: string) => {
    setFormData((prev) => ({
      ...prev,
      symbol: prev.symbol === symbol ? "" : symbol,
    }));
  };

  const handleMultiSelect = (
    id: string,
    selectedArray: string[],
    setFunction: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFunction((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patternIds = selectedPatterns.join(", ");
    const supportIds = selectedSupports.join(", ");
    const additionalIds = selectedAdditionals.join(", ");
    onSubmit({
      ...formData,
      pattern: patternIds,
      support: supportIds,
      additional: additionalIds,
    });
    // Reset only specific fields
    setFormData((prev) => ({
      ...prev,
      support: "",
      additional: "",
      r: 0,
      feeling: "",
    }));
    setSelectedSupports([]);
    setSelectedAdditionals([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DateTimeInput
        date={formData.date}
        time={formData.time}
        onChange={handleChange}
      />

      <SymbolInput
        symbol={formData.symbol}
        onChange={handleChange}
        onSymbolCheck={handleSymbolCheck}
        predefinedSymbols={predefinedSymbols}
      />

      <CheckboxGroupInput
        label="Pattern"
        name="pattern"
        options={patterns}
        selectedValues={selectedPatterns}
        onChange={(id) => handleMultiSelect(id, selectedPatterns, setSelectedPatterns)}
        readOnly
        required
      />

      <CheckboxGroupInput
        label="Support"
        name="support"
        options={supports}
        selectedValues={selectedSupports}
        onChange={(id) => handleMultiSelect(id, selectedSupports, setSelectedSupports)}
        readOnly
        required
      />

      <CheckboxGroupInput
        label="Additional"
        name="additional"
        options={additionals}
        selectedValues={selectedAdditionals}
        onChange={(id) => handleMultiSelect(id, selectedAdditionals, setSelectedAdditionals)}
        readOnly
      />

      <FeelingInput value={formData.feeling} onChange={handleChange} />

      <NumberInput
        label="R"
        name="r"
        value={formData.r}
        onChange={handleChange}
        step="0.1"
        min={-1}
        required
      />

      <NumberInput
        label="SL Value"
        name="stopLossValue"
        value={formData.stopLossValue}
        onChange={handleChange}
        step="0.01"
        min={-1}
        required
      />

      <Button type="submit">Add Entry</Button>
    </form>
  );
};

export default DataInput;