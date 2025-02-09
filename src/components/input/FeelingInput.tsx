import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FeelingInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const FeelingInput: React.FC<FeelingInputProps> = ({ value, onChange }) => (
    <div>
      <Label htmlFor="feeling">Feeling</Label>
      <Input
        type="text"
        id="feeling"
        name="feeling"
        value={value}
        onChange={onChange}
        placeholder="Enter your feeling about this trade"
      />
    </div>
  );