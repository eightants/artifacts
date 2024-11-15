import { useThemeContext } from "src/components/ThemeContext";

type Props = {
  artifactName: string;
};

export function ArtifactItemPage({ artifactName }: Props) {
  const { isDark } = useThemeContext();

  return (
    <div
      className={`min-h-screen ${
        isDark ? "dark" : ""
      } mt-12 mb-6 relative w-full max-w-[1000px] mx-auto`}
    >
      <div className="w-full text-center">
        <h1 className="text-5xl lg:text-[100px] font-semibold uppercase">
          Artifacts
        </h1>
      </div>
    </div>
  );
}
