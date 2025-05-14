import React from "react";

interface Props {
  selectedTheme: string;
  onChange: (theme: string) => void;
}

const ThemeSelector: React.FC<Props> = ({ selectedTheme, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium text-sm mb-2">Select Resume Theme</label>
      <select
        value={selectedTheme}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 text-sm w-full max-w-xs"
      >
        <option value="teal">Teal (Modern)</option>
        <option value="classic">Classic</option>
        <option value="minimalist">Minimalist</option>
      </select>
    </div>
  );
};

export default ThemeSelector;