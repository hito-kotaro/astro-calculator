import { useState } from "react";

export interface inputTextHooks {
  value: string;
  initValue: (s: string) => void;
  setValue: (newValue: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearValue: () => void;
}

export const useInputText = (defaultValue?: string) => {
  const [value, setValue] = useState(defaultValue ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  const clearValue = () => {
    setValue("");
  };

  const initValue = (s: string) => {
    setValue(s);
  };

  return { value, initValue, handleChange, clearValue };
};
