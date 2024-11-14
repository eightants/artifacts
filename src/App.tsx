import { ArtifactListPage } from "src/components/ArtifactListPage";
import useLocalStorage from "src/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { ThemeContextProvider } from "./components/ThemeContext";
import "./index.css";

function App() {
  const [isDark, setIsDark] = useLocalStorage<boolean>("isDark", false);

  useEffect(() => {
    if (!localStorage.getItem("isDark")) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setIsDark(true);
      }
    } else {
      setIsDark(true);
    }
  }, [setIsDark]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeContextProvider
      value={{
        isDark,
        setIsDark,
      }}
    >
      <div
        className={`min-h-screen ${
          mounted && isDark ? "darkMode" : "lightMode"
        }`}
      >
        <ArtifactListPage />
      </div>
    </ThemeContextProvider>
  );
}

export default App;
