import { lazy, Suspense, useEffect, useState } from "react";
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
};

export function ArtifactListPage({
  artifactName,
  description,
  size,
  scale,
}: Props) {
  const { isDark } = useThemeContext();
  const [products, setProducts] = useState<Artifact[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Artifact[]>([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("dateObtained");

  useEffect(() => {
    // Fetch data from data.json
    fetch(`/${artifactName}/data.json`)
      .then((response) => response.json())
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [artifactName]);

  useEffect(() => {
    const productArray = [...products];

    if (sortBy === "dateObtained") {
      setFilteredProducts(
        sortOrder === "asc"
          ? productArray.sort((a, b) =>
              a.dateObtained.localeCompare(b.dateObtained)
            )
          : productArray.sort((a, b) =>
              b.dateObtained.localeCompare(a.dateObtained)
            )
      );
    } else if (sortBy === "name") {
      setFilteredProducts(
        sortOrder === "asc"
          ? productArray.sort((a, b) => a.title.localeCompare(b.title))
          : productArray.sort((a, b) => b.title.localeCompare(a.title))
      );
    }
  }, [products, sortBy, sortOrder]);

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

      <div className="py-4 flex gap-2">
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
    </div>
  );
}
