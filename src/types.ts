export type Artifact = {
  id: string;
  title: string;
  images: {
    front: string; // path to image
    back?: string; // optional back image
  };
  brand?: string;
  dateObtained: string; // 'YYYY-MM-DD'
  organization?: string[];
  tags: string[];
};
