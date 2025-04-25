
import * as React from "react";
import * as LucideIcons from "lucide-react";

// Define the props for our Icon component
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  // Map our simplified icon names to Lucide icon components
  const iconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    brain: LucideIcons.Brain,
    database: LucideIcons.Database,
    code: LucideIcons.Code,
    palette: LucideIcons.Palette,
    upload: LucideIcons.Upload,
    sparkles: LucideIcons.Sparkles
  };

  // Get the icon component based on the name
  const IconComponent = iconMap[name];

  // If the icon doesn't exist, show a placeholder or return null
  if (!IconComponent) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }

  // Render the icon component with the provided props
  return <IconComponent className={className} {...props} />;
};

export default Icon;
