"use client";

import { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBoundaryNames } from "./boundaries";
import { cn } from "@/lib/utils";
import type { BoundarySelectorProps } from "./types";

export function BoundarySelector({
  value,
  onValueChange,
  allowedBoundaries,
  className,
}: BoundarySelectorProps) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const allBoundaries = getBoundaryNames();
  const availableBoundaries = allowedBoundaries
    ? allBoundaries.filter((b) => allowedBoundaries.includes(b.id))
    : allBoundaries;

  return (
    <div className={cn("absolute top-4 right-4 z-1000", className)}>
      <Select value={value} onValueChange={onValueChange} key={value}>
        <SelectTrigger className="w-[200px] bg-background shadow-md border">
          <SelectValue placeholder="Selecione um estado" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5} className="z-1001">
          {availableBoundaries.map((boundary) => (
            <SelectItem key={boundary.id} value={boundary.id}>
              {boundary.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
