import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/Select";
import * as React from "react";

interface DropdownValue {
  label: string;
  value: string;
}

export interface DropdownProps {
  prefix?: string;
  label: string;
  defaultValue?: string;
  options: DropdownValue[];
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  prefix,
  defaultValue,
  label,
  options,
  onChange,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-auto border-primaryText border rounded-full py-1 pl-4 uppercase text-sm">
        {prefix} <SelectValue placeholder={defaultValue} />
      </SelectTrigger>
      <SelectContent className="bg-primary min-w-[160px]">
        {options.map((option, index) => (
          <SelectItem key={index} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
