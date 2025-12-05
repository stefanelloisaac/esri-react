"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapColorPickerProps } from "../_types";

export function MapColorPicker({
  selectedColor,
  onColorChange,
  disabled = false,
  className,
}: MapColorPickerProps) {
  const [color, setColor] = useState(selectedColor.hex);

  const handleColorChange = (hex: string) => {
    setColor(hex);
    onColorChange({
      id: "custom",
      name: "Personalizado",
      hex,
      fillOpacity: 0.25,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          title="Selecionar cor de desenho"
          className={cn("hover:bg-accent/50 h-7 w-7 relative", className)}
        >
          <Palette className="h-4 w-4" />
          <div
            className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-background"
            style={{ backgroundColor: selectedColor.hex }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 z-1001 -ml-1" align="start">
        <HexColorPicker color={color} onChange={handleColorChange} />
      </PopoverContent>
    </Popover>
  );
}
