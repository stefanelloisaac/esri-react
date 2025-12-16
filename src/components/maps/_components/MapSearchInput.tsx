"use client";

import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapSearchInputProps } from "../_types";

export function MapSearchInput({
  onSearch,
  onCycle,
  placeholder = "Buscar...",
  className,
  value: externalValue,
}: MapSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [, startTransition] = useTransition();

  const value = externalValue !== undefined ? externalValue : inputValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (externalValue === undefined) {
      setInputValue(newValue);
    }

    startTransition(() => {
      onSearch?.(newValue);
    });
  };

  const handleClear = () => {
    if (externalValue === undefined) {
      setInputValue("");
    }
    onSearch?.("");
  };

  return (
    <div className={cn("relative w-[400px]", className)}>
      <div className="relative h-9 bg-background/95 backdrop-blur-sm flex items-center border border-input rounded-md shadow-md transition-colors focus-within:border-primary">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) {
                onCycle?.();
              }
            }
          }}
          className="flex-1 w-full bg-transparent px-3 py-0 text-sm font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ paddingRight: "2.5rem" }}
        />
        <span className="absolute right-0 pr-2 text-muted-foreground flex items-center">
          {value.length > 0 ? (
            <button
              onClick={handleClear}
              className="hover:bg-accent p-1 rounded-sm transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
      </div>
    </div>
  );
}
