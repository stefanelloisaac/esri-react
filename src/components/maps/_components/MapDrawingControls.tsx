"use client";

import { Button } from "@/components/ui/button";
import { Save, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapColorPicker } from "./MapColorPicker";
import { MapDrawingControlsProps } from "../_types";

export function MapDrawingControls({
  onSave,
  onClear,
  selectedColor,
  onColorChange,
  className,
  disabled = false,
  hasUnsavedChanges = false,
}: MapDrawingControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 h-9 shadow-md rounded-md border border-input bg-background/95 backdrop-blur-sm px-1",
        className,
      )}
    >
      {selectedColor && onColorChange && (
        <MapColorPicker
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          disabled={disabled}
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        disabled={disabled}
        title="Salvar desenhos localmente"
        className={cn(
          "hover:bg-emerald-600/10 hover:text-emerald-600 h-7 flex-1 relative",
          hasUnsavedChanges &&
            "text-amber-600 hover:text-amber-700 animate-pulse hover:bg-amber-600/10",
        )}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        disabled={disabled}
        title="Limpar todos os desenhos"
        className="hover:bg-destructive/10 hover:text-destructive h-7 flex-1"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
