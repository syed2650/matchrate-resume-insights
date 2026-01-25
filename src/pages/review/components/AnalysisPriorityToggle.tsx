import { useState } from "react";
import { Target, Cpu, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnalysisPriority = "interviews" | "ats" | "growth";

interface AnalysisPriorityToggleProps {
  value: AnalysisPriority;
  onChange: (value: AnalysisPriority) => void;
}

const priorities = [
  {
    id: "interviews" as AnalysisPriority,
    icon: Target,
    label: "Get Interviews Faster",
    description: "Focus on what recruiters look for"
  },
  {
    id: "ats" as AnalysisPriority,
    icon: Cpu,
    label: "Beat ATS",
    description: "Optimise for automated screening"
  },
  {
    id: "growth" as AnalysisPriority,
    icon: TrendingUp,
    label: "Career Growth",
    description: "Position for advancement"
  }
];

export const AnalysisPriorityToggle = ({ value, onChange }: AnalysisPriorityToggleProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        🎯 What matters most to you?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {priorities.map((priority) => {
          const Icon = priority.icon;
          const isSelected = value === priority.id;
          
          return (
            <button
              key={priority.id}
              type="button"
              onClick={() => onChange(priority.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 bg-background hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isSelected ? "bg-primary/10" : "bg-muted/50"
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {priority.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {priority.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
