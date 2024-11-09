# Shirts
Because every shirt has a story

The `data.json` file follows this format:

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