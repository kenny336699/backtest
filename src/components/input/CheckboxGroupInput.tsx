import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface CheckboxOption {
    id: string;
    name: string;
  }
  
  interface CheckboxGroupInputProps {
    label: string;
    name: string;
    options: CheckboxOption[];
    selectedValues: string[];
    onChange: (id: string) => void;
    readOnly?: boolean;
    required?: boolean;
  }
  
  export const CheckboxGroupInput: React.FC<CheckboxGroupInputProps> = ({
    label,
    name,
    options,
    selectedValues,
    onChange,
    readOnly = false,
    required = false,
  }) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type="text"
        id={name}
        name={name}
        value={selectedValues.join(", ")}
        readOnly={readOnly}
        required={required}
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option.id} className="inline-flex items-center">
            <Checkbox
              checked={selectedValues.includes(option.id)}
              onCheckedChange={() => onChange(option.id)}
            />
            <span className="ml-2">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
  