import { Artifact } from "../types";

type Props = {
  product: Artifact;
  artifactName: string;
  size?: number;
  scale?: number;
};

export function ArtifactItemCard({
  product,
  artifactName,
  size = 3,
  scale = 1,
}: Props) {
  return (
    <div
      className={`p-1 md:basis-1/2 ${
        size === 4 ? "lg:basis-1/4" : "lg:basis-1/3"
      } basis-full text-left`}
    >
      <div className="group block cursor-pointer rounded-xl bg-secondary border border-border p-2 lg:p-6 hover:bg-secondary transition-background duration-[0.5s] w-full h-[240px] lg:h-[280px]">
        <div className="relative h-full">
          <img
            src={`/${artifactName}/output/${product.images.front}`}
            alt={product.title}
            className={`w-full h-full object-contain ${
              product.images.back && "group-hover:hidden"
            }`}
            style={{ transform: `scale(${scale})` }}
          />
          {product.images.back && (
            <img
              loading="lazy"
              src={`/${artifactName}/output/${product.images.back}`}
              alt={`${product.title} back`}
              className="w-full h-full object-contain absolute top-0 left-0 group-hover:block hidden"
              height="100%"
              width="auto"
            />
          )}
        </div>
      </div>
      <div className="flex items-start justify-between px-1 pt-2 pb-8">
        <div className="text-md font-medium uppercase">{product.title}</div>
        <div className="text-md font-medium text-secondaryText">
          {product.dateObtained.split("-")[0]}
        </div>
      </div>
    </div>
  );
}
