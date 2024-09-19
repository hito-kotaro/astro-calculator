import { useState } from "react";

export interface inputNumberHooks {
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
}

export const useInputNumber = (defaultValue?: number) => {
  const [value, setValue] = useState(defaultValue ?? 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(Number(newValue));
  };

  const clearValue = () => {
    setValue(1);
  };

  return { value, handleChange, clearValue };
};
