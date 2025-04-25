
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VersionSelectorProps {
  activeVersion: string;
  atsScores: Record<string, number>;
  onVersionChange: (value: string) => void;
}

const VersionSelector = ({ activeVersion, atsScores, onVersionChange }: VersionSelectorProps) => {
  // Create a copy of the scores object to avoid unwanted modifications
  const scoreValues = {...atsScores};
  
  return (
    <Tabs 
      value={activeVersion} 
      className="w-full"
      onValueChange={onVersionChange}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="startup">
          Startup Version
          {scoreValues["startup"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {scoreValues["startup"]}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="enterprise">
          Enterprise Version
          {scoreValues["enterprise"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {scoreValues["enterprise"]}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="consulting">
          Consulting Version
          {scoreValues["consulting"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {scoreValues["consulting"]}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default VersionSelector;
