import os
from pathlib import Path
from PIL import Image
import pillow_heif

# Register HEIF plugin
pillow_heif.register_heif_opener()

# Constants
MAX_SIZE = 100_000  # Maximum size in bytes (100 KB)
MAX_DIMENSION = 400  # Maximum width or height in pixels


def compress_image(input_path: Path, output_path: Path):
    """
    Compress an image file to ensure it's under MAX_SIZE and no dimension exceeds MAX_DIMENSION.
    Save the compressed image to the output_path, replacing if it already exists.
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

            # Determine the output format (default to JPEG if format is None or unsupported)
            format = img.format
            if not format or format not in {"JPEG", "PNG", "GIF", "BMP", "HEIC"}:
                format = "JPEG"

            # Convert HEIC to JPEG for saving
            if format == "HEIC":
                format = "JPEG"

            # Handle RGBA images for JPEG format
            if format == "JPEG" and img.mode == "RGBA":
                img = img.convert("RGB")
                print(
                    f"Converted {input_path} from RGBA to RGB for JPEG format.")

            # Save with progressive reduction in quality
            quality = 95
            while True:
                img.save(output_path, format=format, quality=quality)

                if output_path.stat().st_size <= MAX_SIZE or quality <= 10:
                    print(f"Compressed and saved {output_path}.")
                    break

                quality -= 5
                print(f"Reducing quality to {quality} for {output_path}.")

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
