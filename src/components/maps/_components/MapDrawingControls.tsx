"use client";

import { Button } from "@/components/ui/button";
import { Save, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapColorPicker } from "./MapColorPicker";
import { MapDrawingControlsProps } from "../_types";

export function MapDrawingControls({
  onSave,
  onLoad,
  onClear,
  selectedColor,
  onColorChange,
  className,
  disabled = false,
}: MapDrawingControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 h-9 shadow-md rounded-md border border-input bg-background/85! px-2 dark:bg-input/30",
        className
      )}
    >
      {selectedColor && onColorChange && (
        <>
          <MapColorPicker
            selectedColor={selectedColor}
            onColorChange={onColorChange}
            disabled={disabled}
          />
          <div className="w-px h-5 bg-border" />
        </>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onSave}
        disabled={disabled}
        title="Salvar desenhos localmente"
        className="hover:bg-accent/50 hover:text-emerald-600 h-7 w-7"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onLoad}
        disabled={disabled}
        title="Carregar desenhos salvos"
        className="hover:bg-accent/50 hover:text-blue-600 h-7 w-7"
      >
        <Upload className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onClear}
        disabled={disabled}
        title="Limpar todos os desenhos"
        className="hover:bg-destructive/10 hover:text-destructive h-7 w-7"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
