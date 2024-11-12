import React, { useEffect, useState } from "react";
import "./index.css";
import "./storefront.css";

interface TShirt {
  title: string;
  images: {
    front: string; // path to image
    back?: string; // optional back image
  };
  brand?: string;
  dateObtained: string; // 'YYYY-MM-DD'
  organization: string[];
  tags: string[];
}

function App() {
  const [products, setProducts] = useState<TShirt[]>([]);

  useEffect(() => {
    // Fetch data from data.json
    fetch("/data.json")
      .then((response) => response.json())
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="storefront text-center">
      <h1 className="text-3xl font-bold mb-6">Artifacts</h1>
      <div className="product-list flex flex-wrap justify-center">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="product border border-gray-300 m-2 p-4 w-64"
          >
            <img
              src={`/output/${product.images.front}`}
              alt={product.title}
              className="max-w-full h-auto"
            />
            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-gray-600">{product.dateObtained}</p>
            <p className="text-gray-600">{product.organization.join(", ")}</p>
            <p className="text-gray-600">{product.tags.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
