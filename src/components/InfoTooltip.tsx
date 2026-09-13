import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export const SCIENTIFIC_TERMS: Record<string, string> = {
  ndvi: "Measures plant health from satellite images; unusual patterns can hint at mineral-rich soil below.",
  lst: "Ground surface heat measured by satellite; certain minerals affect how the ground retains heat.",
  soilMoisture: "How much water the soil holds; helps rule out or confirm certain rock formations.",
  swir: "A satellite signal that helps detect manganese-bearing minerals on the surface.",
  magneticAnomaly: "Tiny variations in the Earth's magnetic field that can indicate dense ore bodies underground.",
  gravityAnomaly: "Tiny variations in the Earth's gravity field that can indicate dense ore bodies underground.",
  confidence: "How sure the model is about this prediction, from 0 to 100%.",
  grade: "The percentage of manganese content found in the ore sample — higher is better quality.",
  insar: "Satellite radar measuring millimeter-scale slope stability and pit ground motion.",
};

interface InfoTooltipProps {
  termKey?: keyof typeof SCIENTIFIC_TERMS | string;
  text?: string;
  className?: string;
  iconClassName?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  termKey,
  text,
  className = "",
  iconClassName = "w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors",
  position = "top",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const explanation = text || (termKey ? SCIENTIFIC_TERMS[termKey] : "") || "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  if (!explanation) return null;

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  }[position];

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ml-1 select-none ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer p-0.5 rounded-full hover:bg-slate-200/60 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400"
        aria-label="Explain scientific term"
      >
        <Info className={iconClassName} />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-[9999] w-64 max-w-[85vw] p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md text-slate-100 text-[11px] leading-relaxed shadow-xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left font-normal ${positionStyles}`}
        >
          <p className="m-0 font-sans">{explanation}</p>
          <div className="text-[9px] text-cyan-300 font-semibold mt-1">
            Plain language summary
          </div>
        </div>
      )}
    </span>
  );
};
