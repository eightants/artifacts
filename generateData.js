const fs = require("fs");
const path = require("path");

const artifactName = "shirts";

// Path to the output folder
const outputDir = path.join(__dirname, "public", artifactName, "output");
const dataFilePath = path.join(__dirname, "public", artifactName, "data.json");

// Read existing data.json
fs.readFile(dataFilePath, "utf8", (err, dataContent) => {
  if (err) {
    console.error("Error reading data.json:", err);
    return;
  }

  let existingData;
  try {
    existingData = JSON.parse(dataContent).data || [];
  } catch (parseError) {
    console.error("Error parsing data.json:", parseError);
    return;
  }

  // Extract existing image filenames from both front and back images
  const existingImages = new Set();
  existingData.forEach((item) => {
    existingImages.add(item.images.front);
    if (item.images.back) {
      existingImages.add(item.images.back);
    }
  });

  // Read all files in the output directory
  fs.readdir(outputDir, (err, files) => {
    if (err) {
      console.error("Error reading output directory:", err);
      return;
    }

    // Filter out non-image files if necessary
    const imageFiles = files.filter((file) =>
      /\.(png|jpg|jpeg|gif)$/i.test(file)
    );

    // Create JSON entries for new images
    const newEntries = imageFiles
      .filter((file) => !existingImages.has(file))
      .map((file, index) => ({
        id: `${existingData[existingData.length - 1].index + index + 1}`,
        title: `Artifact ${existingData.length + index + 1}`,
        images: {
          front: file,
        },
        brand: "Unknown",
        dateObtained: new Date().toISOString().split("T")[0], // Current date
        organization: ["unknown"],
        tags: ["artifact"],
      }));

    // Combine existing data with new entries
    const updatedData = [...existingData, ...newEntries];

    // Write the updated data to data.json
    const jsonData = JSON.stringify({ data: updatedData }, null, 2);
    fs.writeFile(dataFilePath, jsonData, (err) => {
      if (err) {
        console.error("Error writing data.json:", err);
      } else {
        console.log("data.json has been updated successfully.");
      }
    });
  });
});
