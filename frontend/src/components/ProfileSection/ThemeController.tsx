import { FaPalette } from 'react-icons/fa';
import { useState, useEffect} from "react";

const allThemes = [
  "light", "dark", 
  "acid", "aqua", "autumn", "business", "bumblebee", "coffee", 
  "corporate", "cupcake", "cyberpunk", "dim", "dracula", "emerald", 
  "fantasy", "forest", "garden", "halloween", "lemonade", 
  "luxury", "night", "nord", "pastel", "retro", "sunset", "synthwave", 
  "valentine", "winter"
];

// Define the type for the themeColors
type ThemeColorMap = {
  [key: string]: string[];
};

// Theme color representation (simplified, actual colors may vary)
const themeColors: ThemeColorMap = {
  light: ["#ffffff", "#d1d5db", "#570df8"],
  dark: ["#2a303c", "#374151", "#661ae6"],
  acid: ["#ffff00", "#00ffff", "#ff00ff"],
  aqua: ["#13b5ea", "#b8e3f3", "#99d4e9"],
  autumn: ["#f8f2e4", "#cc9c80", "#8c5e33"],
  //black: ["#000000", "#333333", "#ffffff"],
  business: ["#ffffff", "#d7dde4", "#1c4f82"],
  bumblebee: ["#ffffff", "#f8e8a0", "#e0a82e"],
  coffee: ["#20161f", "#463636", "#a37a5c"],
  corporate: ["#ffffff", "#9ca3af", "#4b6bfb"],
  cupcake: ["#faf7f5", "#efeae6", "#ef9fbc"],
  cyberpunk: ["#ffee00", "#ff7598", "#75d1f0"],
  dim: ["#2d3250", "#424868", "#d941e2"],
  dracula: ["#282a36", "#44475a", "#bd93f9"],
  emerald: ["#ffffff", "#c3ddcb", "#66cc8a"],
  fantasy: ["#ffe799", "#d8b4fe", "#fda4af"],
  forest: ["#171212", "#372f21", "#5a7d5a"],
  garden: ["#e9e7dc", "#d5d0ba", "#5c7f67"],
  halloween: ["#212121", "#f28c18", "#6d3a9c"],
  lemonade: ["#ffffff", "#fff1c3", "#94c120"],
  //lofi: ["#f5f5f5", "#dcdcdc", "#1a1919"],
  luxury: ["#170b09", "#463f3a", "#ddbea9"],
  night: ["#0f172a", "#1e293b", "#38bdf8"],
  nord: ["#eceff4", "#e5e9f0", "#5e81ac"],
  pastel: ["#fbfbfb", "#fdd6e5", "#b6dbef"],
  retro: ["#e4d8b4", "#e9e7dc", "#6b7b6e"],
  sunset: ["#fde68a", "#fee3be", "#f43f5e"],
  synthwave: ["#2d1b69", "#e779c1", "#ff7edb"],
  valentine: ["#f0d6e8", "#f0b6d3", "#e96d8a"],
  //wireframe: ["#ffffff", "#b8b8b8", "#374151"],
  winter: ["#e1f3fd", "#b0daf5", "#81b9dc"]
};
// Ensure we have fallback colors for any theme that might be missing
const defaultColors = ["#cccccc", "#aaaaaa", "#888888"];

export default function ThemeController() {
  const currentTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(currentTheme? currentTheme : "light");  

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
  return (
    <div className="dropdown w-full">
      <div tabIndex={0} role="button" className="w-full font-bold text-xl">
      Theme  <FaPalette className="text-base-content opacity-70 mr-2 text-xl inline" /> 
      </div>
      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-60 p-2 shadow-2xl max-h-96 overflow-y-auto">
        {allThemes.map((theme) => (
          <li key={theme} className="relative">
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm btn-ghost justify-start"
              aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
              value={theme}
              onChange={handleThemeChange}
            />
            <div className="flex ml-2 absolute right-2 top-1/2 transform -translate-y-1/2">
              {(themeColors[theme] || defaultColors).map((color, index) => (
                <div 
                  key={index} 
                  className="w-4 h-4 rounded-full ml-1" 
                  style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};