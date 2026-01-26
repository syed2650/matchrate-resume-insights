import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Sparkles, 
  Shield, 
  Target, 
  Flame,
  Check,
  Loader2
} from "lucide-react";

export type AnalysisTab = "summary" | "resume" | "ats" | "jdmatch" | "roast";

interface TabConfig {
  id: AnalysisTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  color: string;
}

const tabs: TabConfig[] = [
  { 
    id: "summary", 
    label: "Executive Summary", 
    shortLabel: "Summary",
    icon: <LayoutDashboard className="h-4 w-4" />,
    color: "text-slate-600"
  },
  { 
    id: "resume", 
    label: "Resume Strength", 
    shortLabel: "Strength",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-blue-600"
  },
  { 
    id: "ats", 
    label: "ATS Safety", 
    shortLabel: "ATS",
    icon: <Shield className="h-4 w-4" />,
    color: "text-emerald-600"
  },
  { 
    id: "jdmatch", 
    label: "Job Fit", 
    shortLabel: "Job Fit",
    icon: <Target className="h-4 w-4" />,
    color: "text-purple-600"
  },
  { 
    id: "roast", 
    label: "Roast Review", 
    shortLabel: "Roast",
    icon: <Flame className="h-4 w-4" />,
    color: "text-orange-600"
  }
];

interface AnalysisTabsNavigationProps {
  activeTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
  completedTabs?: AnalysisTab[];
  loadingTabs?: AnalysisTab[];
}

export const AnalysisTabsNavigation = ({
  activeTab,
  onTabChange,
  completedTabs = [],
  loadingTabs = []
}: AnalysisTabsNavigationProps) => {
  return (
    <div className="w-full">
      {/* Progress Bar - Desktop */}
      <div className="hidden md:flex items-center justify-between mb-6 bg-slate-50 rounded-xl p-1.5">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = completedTabs.includes(tab.id);
          const isLoading = loadingTabs.includes(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-white shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              <span className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                isActive ? `${tab.color} bg-white ring-2 ring-offset-1 ring-current` :
                isCompleted ? "bg-emerald-100 text-emerald-600" :
                "bg-slate-200 text-slate-500"
              )}>
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : isCompleted ? (
                  <Check className="h-3 w-3" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="hidden lg:inline">{tab.label}</span>
              <span className="lg:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = completedTabs.includes(tab.id);
          const isLoading = loadingTabs.includes(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                tab.icon
              )}
              {tab.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};
