
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type JobSectorType = "saas" | "enterprise" | "public" | "startup" | "consulting" | "general";

interface JobSectorDropdownProps {
  selectedSector: JobSectorType;
  onSectorChange: (sector: JobSectorType) => void;
}

const sectors: { id: JobSectorType; label: string; description: string }[] = [
  {
    id: "saas",
    label: "SaaS",
    description: "Software-as-a-Service companies"
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Large traditional corporations"
  },
  {
    id: "public",
    label: "Public Sector",
    description: "Government and public institutions"
  },
  {
    id: "startup",
    label: "Startup",
    description: "Early-stage innovative companies"
  },
  {
    id: "consulting",
    label: "Consulting",
    description: "Professional services and consulting firms"
  },
  {
    id: "general",
    label: "General",
    description: "Universal resume format"
  }
];

const JobSectorDropdown: React.FC<JobSectorDropdownProps> = ({
  selectedSector,
  onSectorChange
}) => {
  // Find the currently selected sector
  const currentSector = sectors.find(s => s.id === selectedSector) || sectors[0];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Job Sector</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="w-full justify-between border-slate-200 bg-white text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <span>{currentSector.label}</span>
              <Badge variant="outline" className="font-normal text-xs bg-slate-50">
                {currentSector.description}
              </Badge>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px] bg-white">
          {sectors.map((sector) => (
            <DropdownMenuItem
              key={sector.id}
              onClick={() => onSectorChange(sector.id)}
              className="cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{sector.label}</span>
                <span className="text-xs text-slate-500">{sector.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default JobSectorDropdown;
