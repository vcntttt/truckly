import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme-provider";

export const ToggleThemeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};
