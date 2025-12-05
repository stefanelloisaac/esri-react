"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapSearchInputProps } from "../_types";

export function MapSearchInput({
  onSearch,
  placeholder = "Buscar...",
  className,
}: MapSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    startTransition(() => {
      onSearch?.(value);
    });
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="w-[400px] pl-8 shadow-md border bg-background/85! text-foreground!"
      />
    </div>
  );
}
