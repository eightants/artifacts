import os
from pathlib import Path
from PIL import Image
import pillow_heif

# Register HEIF plugin
pillow_heif.register_heif_opener()

# Constants
MAX_SIZE = 50_000  # Maximum size in bytes (50 KB)
MAX_DIMENSION = 300  # Maximum width or height in pixels


def compress_image(input_path: Path, output_path: Path):
    """
    Compress an image file to ensure it's under MAX_SIZE and no dimension exceeds MAX_DIMENSION.
    Maintain transparency for images with an alpha channel.
    """
    try:
        with Image.open(input_path) as img:
            # Ensure image dimensions are within limits
            width, height = img.size
            if max(width, height) > MAX_DIMENSION:
                scaling_factor = MAX_DIMENSION / max(width, height)
                new_size = (int(width * scaling_factor),
                            int(height * scaling_factor))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                print(f"Resized {input_path} to {new_size}.")

            # Handle transparency
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                format = "PNG"  # Use PNG for transparent images
                print(f"Saving {input_path} as PNG to maintain transparency.")
            else:
                format = "JPEG"  # Use JPEG for non-transparent images
                if img.mode != "RGB":
                    img = img.convert("RGB")
                    print(f"Converted {input_path} to RGB for JPEG format.")

            # Save with progressive reduction in quality or compression
            quality = 95 if format == "JPEG" else None  # Quality applies to JPEG only
            while True:
                temp_file = output_path.with_suffix(f".temp.{format.lower()}")
                img.save(temp_file, format=format,
                         quality=quality, optimize=True)

                if temp_file.stat().st_size <= MAX_SIZE or (quality is not None and quality <= 10):
                    temp_file.rename(output_path)
                    print(f"Compressed and saved {output_path}.")
                    break

                if format == "JPEG":
                    quality -= 5
                    print(f"Reducing quality to {quality} for {output_path}.")
                else:
                    print(f"Unable to reduce size of {output_path} further.")
                    temp_file.rename(output_path)
                    break

    except Exception as e:
        print(f"Error processing {input_path}: {e}")


def create_sibling_directory(input_dir: Path, sibling_dir: Path):
    """
    Create a sibling directory and compress all images from the input directory.
    """
    if not sibling_dir.exists():
        sibling_dir.mkdir(parents=True)

    for root, _, files in os.walk(input_dir):
        rel_root = Path(root).relative_to(input_dir)
        sibling_root = sibling_dir / rel_root

        # Ensure the equivalent sub-directory exists in the sibling directory
        sibling_root.mkdir(parents=True, exist_ok=True)

        for file_name in files:
            input_file = Path(root) / file_name
            if input_file.suffix.lower() in {".heic", ".jpg", ".jpeg", ".png", ".gif", ".bmp"}:
                output_file = sibling_root / input_file.name
                print(f"Processing {input_file} to {output_file}...")
                compress_image(input_file, output_file)


directory_path = 'public/stickers/output'

if __name__ == "__main__":
    source_dir = Path(directory_path)
    sibling_dir = source_dir.parent / f"{source_dir.name}_compressed"

    if not source_dir.exists():
        print(f"Source directory {source_dir} does not exist.")
    else:
        create_sibling_directory(source_dir, sibling_dir)
