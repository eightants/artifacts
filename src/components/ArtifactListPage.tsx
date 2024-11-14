import { useEffect, useState } from "react";
import { ArtifactItemCard } from "src/components/ArtifactItemCard";
import { useThemeContext } from "src/components/ThemeContext";
import "src/index.css";
import { TShirt } from "src/types";

export function ArtifactListPage() {
  const { isDark } = useThemeContext();
  const [products, setProducts] = useState<TShirt[]>([]);

  useEffect(() => {
    // Fetch data from data.json
    fetch("/data.json")
      .then((response) => response.json())
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDark ? "dark" : ""
      } text-center mt-12 mb-6 relative w-full max-w-[1000px] mx-auto`}
    >
      <h1 className="text-3xl font-bold mb-6">Artifacts</h1>
      <div className="flex flex-wrap -mx-2">
        {products.map((product, idx) => (
          <ArtifactItemCard key={idx} product={product} />
        ))}
      </div>
    </div>
  );
}
