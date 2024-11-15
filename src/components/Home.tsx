import { useThemeContext } from "src/components/ThemeContext";

export function Home() {
  const { isDark } = useThemeContext();

  return (
    <div
      className={` ${
        isDark ? "dark" : ""
      } mt-12 mb-6 relative w-full max-w-[1000px] mx-auto`}
    >
      <div className="flex flex-col gap-8">
        <div className="w-full text-center max-w-[600px] mx-auto">
          <h1 className="text-5xl lg:text-[100px] font-semibold uppercase mb-2">
            Artifacts
          </h1>
          <p>
            We all hold onto things that carry memories: a concert tee, a
            festival sticker, a ticket stub, or a small keepsake from a friend.
            These items remind us of our favorite moments, but they also start
            to pile up.
          </p>
          <div className="flex gap-4 mt-4 justify-evenly">
            <a className="uppercase underline" href="/how-it-works">
              How it works
            </a>
            <a className="uppercase underline" href="/">
              Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
