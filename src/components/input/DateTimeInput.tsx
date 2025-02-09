import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeInputProps {
  date: string;
  time: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  date,
  time,
  onChange,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="date">Date</Label>
      <Input
        type="date"
        id="date"
        name="date"
        value={date}
        onChange={onChange}
        required
      />
    </div>
    <div>
      <Label htmlFor="time">Time</Label>
      <Input
        type="time"
        id="time"
        name="time"
        value={time}
        onChange={onChange}
        required
      />
    </div>
  </div>
);