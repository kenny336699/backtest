import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface NumberInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  min?: number;
  required?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  name,
  value,
  onChange,
  step = "0.01",
  min,
  required = false,
}) => {
  const adjustValue = (adjustment: number) => {
    // Guard against NaN
    const currentValue = isNaN(value) ? 0 : value;
    // Round to 3 decimal places and prevent floating point errors
    const newValue = Math.round((currentValue + adjustment) * 1000) / 1000;
    
    // Don't go below minimum if specified
    const finalValue = min !== undefined ? Math.max(min, newValue) : newValue;
  
    const syntheticEvent = {
      target: {
        name,
        value: finalValue.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };
  

  const incrementButtons = [
    { value: 1, label: "+1" },
    { value: 0.1, label: "+0.1" },
    { value: 0.01, label: "+0.01" },
    { value: 0.001, label: "+0.001" },
  ];

  const decrementButtons = [
    { value: -1, label: "-1" },
    { value: -0.1, label: "-0.1" },
    { value: -0.01, label: "-0.01" },
    { value: -0.001, label: "-0.001" },
  ];

  // Format the display value to 3 decimal places
  const displayValue = Number(value).toFixed(3);

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={displayValue}
        onChange={onChange}
        step={step}
        min={min}
        required={required}
        className="w-24"
      />
      <div className="grid grid-cols-4 gap-1">
        {incrementButtons.map((btn) => (
          <Button
            key={btn.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjustValue(btn.value)}
            className="px-2 py-1 text-xs"
          >
            {btn.label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {decrementButtons.map((btn) => (
          <Button
            key={btn.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjustValue(btn.value)}
            className="px-2 py-1 text-xs"
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};