import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BacktestData, BacktestDataInput } from "../types";

interface DataInputProps {
  onSubmit: (data: BacktestDataInput) => void;
}

const predefinedSymbols = ["TSLA", "NVDA", "SPOTCRUDE", "APPLE"];

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
  });

  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "r" ? parseFloat(value) : value,
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          type="text"
          id="symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          required
        />
        <div className="mt-2 space-x-2">
          {predefinedSymbols.map((symbol) => (
            <label key={symbol} className="inline-flex items-center">
              <Checkbox
                checked={formData.symbol === symbol}
                onCheckedChange={() => handleSymbolCheck(symbol)}
              />
              <span className="ml-2">{symbol}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="pattern">Pattern</Label>
        <Input
          type="text"
          id="pattern"
          name="pattern"
          value={selectedPatterns.join(", ")}
          readOnly
          required
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {patterns.map((pattern) => (
            <label key={pattern.id} className="inline-flex items-center">
              <Checkbox
                checked={selectedPatterns.includes(pattern.id)}
                onCheckedChange={() =>
                  handleMultiSelect(
                    pattern.id,
                    selectedPatterns,
                    setSelectedPatterns
                  )
                }
              />
              <span className="ml-2">{pattern.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="support">Support</Label>
        <Input
          type="text"
          id="support"
          name="support"
          value={selectedSupports.join(", ")}
          readOnly
          required
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {supports.map((support) => (
            <label key={support.id} className="inline-flex items-center">
              <Checkbox
                checked={selectedSupports.includes(support.id)}
                onCheckedChange={() =>
                  handleMultiSelect(
                    support.id,
                    selectedSupports,
                    setSelectedSupports
                  )
                }
              />
              <span className="ml-2">{support.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="additional">Additional</Label>
        <Input
          type="text"
          id="additional"
          name="additional"
          value={selectedAdditionals.join(", ")}
          readOnly
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {additionals.map((additional) => (
            <label key={additional.id} className="inline-flex items-center">
              <Checkbox
                checked={selectedAdditionals.includes(additional.id)}
                onCheckedChange={() =>
                  handleMultiSelect(
                    additional.id,
                    selectedAdditionals,
                    setSelectedAdditionals
                  )
                }
              />
              <span className="ml-2">{additional.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="feeling">Feeling</Label>
        <Input
          type="text"
          id="feeling"
          name="feeling"
          value={formData.feeling}
          onChange={handleChange}
          placeholder="Enter your feeling about this trade"
        />
      </div>

      <div className="w-full max-w-xs">
        <Label htmlFor="r">R</Label>
        <Input
          type="number"
          id="r"
          name="r"
          value={formData.r}
          onChange={handleChange}
          step="0.1"
          min={-1}
          required
          className="w-24"
        />
      </div>

      <Button type="submit">Add Entry</Button>
    </form>
  );
};

export default DataInput;
