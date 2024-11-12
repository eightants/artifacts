# Artifacts
Because every item has a story

The `data.json` files follow these formats:

```
interface TShirt {
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