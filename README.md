# Artifacts
Because every item has a story

We all hold onto things that carry memories: a concert tee, a festival sticker, a ticket stub, or a small keepsake from a friend. These items remind us of our favorite moments, but they also start to pile up.

![Preview of site](https://artifacts.viewodyssey.com/preview.png)

## How it works
Artifacts uses a Github repository as your digital space to archive the story, memory, and meaning of the things you have been holding onto without needing to keep every item.

Here's an example of how you would use it to archive your free tshirts from college.

1. In `/public`, create a new folder `/shirts` with two subfolders: `/originals` and `/output`
2. Upload images of all your shirts into `/shirts/originals`
3. Run this [Jupyter notebook](https://www.kaggle.com/code/eightants/artifacts-bulk-object-extraction-from-images) to segment out your artifact from each image. If your device can run ipynb files with GPU, you can do it locally. Otherwise, I recommend Kaggle since you get 30 free GPU hours per week. (If you have photos with multiple artifacts per photo, use [this notebook](https://www.kaggle.com/code/eightants/artifacts-multiple-bounding-boxes-in-one-image) instead)
4. Once this is done, download the zip file output from Kaggle and upload all the segmented images to /shirts/output
5. In `App.tsx`, update `artifactNames` to use the name of your folder, in our case, `shirts`
6. In `generateData.js`, update `artifactName` to use the name of your folder, in our case, `shirts`. Then, run `node generateData.js`

## Data

The `data.json` files follow these formats:

```
interface Artifact {
  title: string;
  images: {
    front: string;  // path to image
    back?: string;  // optional back image
  };
  brand?: string;
  dateObtained: string;  // 'YYYY-MM-DD'
  organization: string[];
  tags: string[];
}
```