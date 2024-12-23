import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { ArtifactCanvasView } from "src/components/ArtifactCanvasView";
import { Dropdown } from "src/components/Dropdown";
import { useThemeContext } from "src/components/ThemeContext";
import "src/index.css";
import { Artifact } from "src/types";

const ArtifactItemCard = lazy(() => import("src/components/ArtifactItemCard"));

type Props = {
  artifactName: string;
  description?: string;
  size?: number;
  scale?: number;
  explorer?: boolean;
};

export function ArtifactListPage({
  artifactName,
  description,
  size,
  scale,
  explorer,
}: Props) {
  const { isDark } = useThemeContext();
  const [products, setProducts] = useState<Artifact[]>([]);
  const [view, setView] = useState("grid");
  const [filteredProducts, setFilteredProducts] = useState<Artifact[]>([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("dateObtained");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Get unique tags from all products
  const allTags = useMemo(() => {
    const tags = products.reduce((acc: string[], product) => {
      if (product.tags) {
        return [...acc, ...product.tags];
      }
      return acc;
    }, []);
    return ["all", ...Array.from(new Set(tags))];
  }, [products]);

  useEffect(() => {
    // Fetch data from data.json
    fetch(`/${artifactName}/data.json`)
      .then((response) => response.json())
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [artifactName]);

  useEffect(() => {
    let filteredArray = [...products];

    // First apply tag filter if not "all"
    if (selectedTag !== "all") {
      filteredArray = filteredArray.filter((product) =>
        product.tags?.includes(selectedTag)
      );
    }

    // Then apply sorting
    if (sortBy === "dateObtained") {
      setFilteredProducts(
        sortOrder === "asc"
          ? filteredArray.sort((a, b) =>
              a.dateObtained.localeCompare(b.dateObtained)
            )
          : filteredArray.sort((a, b) =>
              b.dateObtained.localeCompare(a.dateObtained)
            )
      );
    } else if (sortBy === "name") {
      setFilteredProducts(
        sortOrder === "asc"
          ? filteredArray.sort((a, b) => a.title.localeCompare(b.title))
          : filteredArray.sort((a, b) => b.title.localeCompare(a.title))
      );
    }
  }, [products, sortBy, sortOrder, selectedTag]);

  return (
    <div
      className={`min-h-screen ${
        isDark ? "dark" : ""
      } mt-12 mb-6 relative w-full max-w-[1000px] mx-auto`}
    >
      <div className="mb-6 lg:mb-[80px] flex flex-col lg:flex-row justify-between items-start">
        <div className="flex items-start">
          <h1 className="text-4xl lg:text-[100px] font-medium uppercase">
            {artifactName}
          </h1>
          <div>{products.length}</div>
        </div>

        <div className="w-full lg:w-1/2">{description}</div>
      </div>

      <div className="flex justify-between lg:flex-row flex-col">
        <div className="py-4 flex gap-2 lg:flex-row flex-col">
          <div>
            <Dropdown
              defaultValue="year"
              label=""
              prefix="Sort by"
              options={[
                {
                  label: "Year",
                  value: "dateObtained",
                },
                {
                  label: "Name",
                  value: "name",
                },
              ]}
              onChange={(value) => {
                setSortBy(value);
              }}
            />
          </div>

          <div>
            <Dropdown
              defaultValue="desc"
              label=""
              options={[
                {
                  label: "Ascending",
                  value: "asc",
                },
                {
                  label: "Descending",
                  value: "desc",
                },
              ]}
              onChange={(value) => {
                setSortOrder(value);
              }}
            />
          </div>

          <div>
            <Dropdown
              defaultValue="all"
              label=""
              prefix="Filter by"
              options={allTags.map((tag) => ({
                label: tag.charAt(0).toUpperCase() + tag.slice(1),
                value: tag,
              }))}
              onChange={(value) => {
                setSelectedTag(value);
              }}
            />
          </div>
        </div>

        {explorer && (
          <div className="py-4 flex gap-2">
            <button
              className={`p-2 border rounded-md hover:bg-primaryText/10 hover:text-primaryText flex items-center gap-2 ${
                view === "grid" ? "bg-primaryText text-primary" : ""
              }`}
              onClick={() => setView("grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`p-2 border rounded-md hover:bg-primaryText/10 hover:text-primaryText flex items-center gap-2 ${
                view === "explorer" ? "bg-primaryText text-primary" : ""
              }`}
              onClick={() => setView("explorer")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 9l-3 3 3 3" />
                <path d="M9 5l3-3 3 3" />
                <path d="M19 9l3 3-3 3" />
                <path d="M9 19l3 3 3-3" />
                <path d="M2 12h20" />
                <path d="M12 2v20" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {explorer && view === "explorer" ? (
        <div className="pb-10">
          <ArtifactCanvasView
            artifactName={artifactName}
            description={description}
            size={size}
            artifacts={filteredProducts}
            totalArtifacts={products.length}
          />
        </div>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {filteredProducts.map((product, idx) => (
            <Suspense
              key={idx}
              fallback={
                <div
                  className={`p-1 md:basis-1/2 ${
                    size === 4 ? "lg:basis-1/4" : "lg:basis-1/3"
                  } basis-full text-left`}
                >
                  <div className="animate-pulse w-full h-[280px] lg:h-[320px] flex flex-col gap-2">
                    <div className="h-6 bg-primaryText opacity-10 rounded-lg"></div>
                    <div className="h-6 bg-primaryText opacity-10 rounded-lg w-[60%]"></div>
                    <div className="h-6 bg-primaryText opacity-10 rounded-lg"></div>
                  </div>
                </div>
              }
            >
              <ArtifactItemCard
                product={product}
                artifactName={artifactName}
                size={size}
                scale={scale}
              />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}
