import { TShirt } from "../types";

type Props = {
  product: TShirt;
};

export function ArtifactItemCard({ product }: Props) {
  return (
    <div className="p-2 md:basis-1/2 lg:basis-1/3 basis-full text-left">
      <div className="group block cursor-pointer rounded-xl bg-secondary border border-border p-2 lg:p-6 hover:bg-secondary transition-background duration-[0.5s] w-full h-[240px] lg:h-[280px]">
        <div className="relative h-full">
          <img
            src={`/output/${product.images.front}`}
            alt={product.title}
            className={`w-full h-full object-contain ${
              product.images.back && "group-hover:hidden"
            }`}
          />
          {product.images.back && (
            <img
              src={`/output/${product.images.back}`}
              alt={`${product.title} back`}
              className="w-full h-full object-contain absolute top-0 left-0 group-hover:block hidden"
            />
          )}
        </div>
      </div>
      <div className="flex gap-2 justify-between px-2">
        <p className="text-md font-medium">{product.title}</p>
        <p className="text-md font-medium text-secondaryText">
          {product.brand}
        </p>
      </div>
    </div>
  );
}
