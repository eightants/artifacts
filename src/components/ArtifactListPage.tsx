import { useEffect, useState } from "react";
import { ArtifactItemCard } from "src/components/ArtifactItemCard";
import { Dropdown } from "src/components/Dropdown";
import { useThemeContext } from "src/components/ThemeContext";
import "src/index.css";
import { Artifact } from "src/types";

type Props = {
  artifactName: string;
  description?: string;
};

export function ArtifactListPage({ artifactName, description }: Props) {
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
          <h1 className="text-4xl lg:text-[100px] font-medium">SHIRTS</h1>
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
          <ArtifactItemCard
            key={idx}
            product={product}
            artifactName={artifactName}
          />
        ))}
      </div>
    </div>
  );
}
