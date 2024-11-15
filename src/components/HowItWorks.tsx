import { useThemeContext } from "src/components/ThemeContext";

export function HowItWorks() {
  const { isDark } = useThemeContext();

  return (
    <div
      className={`min-h-screen ${
        isDark ? "dark" : ""
      } mt-12 mb-6 relative w-full max-w-[1000px] mx-auto`}
    >
      <div className="flex flex-col gap-8">
        <div className="max-w-[600px] mx-auto">
          <h3 className=" uppercase">How it works</h3>
          <div>
            Artifacts uses a Github repository as your digital space to archive
            the story, memory, and meaning of the things you have been holding
            onto without needing to keep every item.
          </div>
          <div>
            Here's an example of how you would use it to archive your free
            tshirts from college.
          </div>

          <ol className="mt-4 list-decimal text-left">
            <li>
              In /public, create a new folder /shirts with two subfolders:
              /originals and /output
            </li>
            <li>Upload images of all your shirts into /shirts/originals</li>
            <li>
              Run{" "}
              <a
                href="https://www.kaggle.com/code/eightants/bulk-object-extraction-from-images"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                this Jupyter notebook
              </a>{" "}
              to segment out your artifact from each image. If your device can
              run ipynb files with GPU, you can do it locally. Otherwise, I
              recommend Kaggle since you get 30 free GPU hours per week.
            </li>
            <li>
              Once this is done, download the zip file output from Kaggle and
              upload all the segmented images to /shirts/output
            </li>
            <li>
              In App.tsx, update <code>artifactNames</code> to use the name of
              your folder, in our case, shirts
            </li>
            <li>
              In generateData.js, update <code>artifactName</code> to use the
              name of your folder, in our case, shirts. Then, run{" "}
              <code>node generateData.js</code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
