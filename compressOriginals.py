# compressOriginals.py
# This script compresses all image files in the current directory to ensure they are under 1 MB in size to keep the repo small
import os
from pathlib import Path
from PIL import Image
import pillow_heif

# Register HEIF plugin
pillow_heif.register_heif_opener()

# Constants
MAX_SIZE = 1_000_000  # Maximum size in bytes (1 MB)
MAX_DIMENSION = 2000  # Maximum width or height in pixels


def compress_image(filepath: Path):
    """
    Compress an image file to ensure it's under MAX_SIZE and no dimension exceeds MAX_DIMENSION.
    """
    try:
        with Image.open(filepath) as img:
            # Ensure image dimensions are within limits
            width, height = img.size
            if max(width, height) > MAX_DIMENSION:
                scaling_factor = MAX_DIMENSION / max(width, height)
                new_size = (int(width * scaling_factor),
                            int(height * scaling_factor))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                print(f"Resized {filepath} to {new_size}.")

            # Determine the output format (default to JPEG if format is None or unsupported)
            format = img.format
            if not format or format not in {"JPEG", "PNG", "GIF", "BMP", "HEIC"}:
                format = "JPEG"

            # Convert HEIC to JPEG for saving
            if format == "HEIC":
                format = "JPEG"

            # Save with progressive reduction in quality
            quality = 95
            while True:
                temp_file = filepath.with_suffix(f".temp.{format.lower()}")
                img.save(temp_file, format=format, quality=quality)

                if temp_file.stat().st_size <= MAX_SIZE or quality <= 10:
                    # Replace original file if compressed successfully
                    temp_file.rename(filepath)
                    break

                temp_file.unlink()  # Delete temporary file
                quality -= 5

    except Exception as e:
        print(f"Error processing {filepath}: {e}")


def process_folder(folder_path: Path):
    """
    Recursively process the originals/ folders and compress image files.
    """
    for root, dirs, files in os.walk(folder_path):
        for dir_name in dirs:
            if dir_name == "originals":
                originals_path = Path(root) / dir_name
                for file in originals_path.iterdir():
                    if file.is_file() and file.suffix.lower() in {".heic", ".jpg", ".jpeg", ".png", ".gif", ".bmp"}:
                        print(f"Processing {file}...")
                        compress_image(file)


if __name__ == "__main__":
    public_path = Path("public/")
    if not public_path.exists():
        print(f"Path {public_path} does not exist.")
    else:
        process_folder(public_path)
