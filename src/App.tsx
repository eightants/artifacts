import { ArtifactListPage } from "src/components/ArtifactListPage";
import useLocalStorage from "src/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { ThemeContextProvider } from "./components/ThemeContext";
import "./index.css";
import { Navbar } from "src/components/Navbar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "src/components/Home";
import { ArtifactItemPage } from "src/components/ArtifactItemPage";
import { HowItWorks } from "src/components/HowItWorks";

type ArtifactItem = {
  path: string;
  description?: string;
};

const artifactNames: ArtifactItem[] = [
  {
    path: "shirts",
    description:
      "College was the golden age of free shirts. I collected shirts from hackathons, internships, and events. Hackathons were especially rewarding, while internships and career fairs often yielded unique ones. By the end, I had a closet full of shirts, each representing a memorable experience. Even now, the collection is still growing.",
  },
];

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
        <Navbar
          items={artifactNames.map(({ path }) => ({
            label: path,
            value: path,
          }))}
        />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {artifactNames.map(({ path, description }) => (
              <>
                <Route
                  key={path}
                  path={`/${path}`}
                  element={
                    <ArtifactListPage
                      artifactName={path}
                      description={description}
                    />
                  }
                />
                <Route
                  key={path}
                  path={`/${path}/:id`}
                  element={<ArtifactItemPage artifactName={path} />}
                />
              </>
            ))}
          </Routes>
        </Router>
      </div>
    </ThemeContextProvider>
  );
}

export default App;
