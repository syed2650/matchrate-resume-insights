
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VersionSelectorProps {
  activeVersion: string;
  atsScores: Record<string, number>;
  onVersionChange: (value: string) => void;
}

const VersionSelector = ({ activeVersion, atsScores, onVersionChange }: VersionSelectorProps) => {
  return (
    <Tabs 
      value={activeVersion} 
      className="w-full"
      onValueChange={onVersionChange}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="startup">
          Startup Version
          {atsScores["startup"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {atsScores["startup"]}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="enterprise">
          Enterprise Version
          {atsScores["enterprise"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {atsScores["enterprise"]}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="consulting">
          Consulting Version
          {atsScores["consulting"] && (
            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
              {atsScores["consulting"]}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default VersionSelector;
