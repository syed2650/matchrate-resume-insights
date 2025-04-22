
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, iconPosition = "left", ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          className={cn(
            iconPosition === "left" ? "pl-10" : "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
