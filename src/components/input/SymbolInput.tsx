import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SymbolInputProps {
    symbol: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSymbolCheck: (symbol: string) => void;
    predefinedSymbols: string[];
  }
  
  export const SymbolInput: React.FC<SymbolInputProps> = ({
    symbol,
    onChange,
    onSymbolCheck,
    predefinedSymbols,
  }) => (
    <div>
      <Label htmlFor="symbol">Symbol</Label>
      <Input
        type="text"
        id="symbol"
        name="symbol"
        value={symbol}
        onChange={onChange}
        required
      />
      <div className="mt-2 space-x-2">
        {predefinedSymbols.map((sym) => (
          <label key={sym} className="inline-flex items-center">
            <Checkbox
              checked={symbol === sym}
              onCheckedChange={() => onSymbolCheck(sym)}
            />
            <span className="ml-2">{sym}</span>
          </label>
        ))}
      </div>
    </div>
  );