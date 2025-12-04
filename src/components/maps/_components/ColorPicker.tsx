"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DRAW_COLORS, DrawColor } from "../_lib/_draw/colors";

export interface ColorPickerProps {
  selectedColor: DrawColor;
  onColorChange: (color: DrawColor) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  selectedColor,
  onColorChange,
  disabled = false,
  className,
}: ColorPickerProps) {
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
      <PopoverContent className="w-56 p-3 z-1001" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium">Escolher cor</p>
          <div className="grid grid-cols-4 gap-2">
            {DRAW_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => onColorChange(color)}
                title={color.name}
                className={cn(
                  "w-10 h-10 rounded-md border-2 transition-all hover:scale-110",
                  selectedColor.id === color.id
                    ? "border-foreground ring-2 ring-ring/50"
                    : "border-transparent hover:border-border"
                )}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor.id === color.id && (
                  <Check className="w-5 h-5 text-white drop-shadow-md mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
