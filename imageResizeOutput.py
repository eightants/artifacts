import os
from PIL import Image
from pathlib import Path
import pillow_heif

# Register HEIF plugin
pillow_heif.register_heif_opener()

# Constants
MAX_SIZE = 500_000  # Maximum size in bytes (1 MB)
MAX_DIMENSION = 1000  # Maximum width or height in pixels


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
                format = "PNG"

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


def resize_image(file_path, max_size=(1920, 1080)):
    """
    Resize the image to fit within the given max size while maintaining aspect ratio.
    :param file_path: Path to the image file
    :param max_size: Maximum size as a tuple (width, height)
    """
    with Image.open(file_path) as img:
        img.thumbnail(max_size)
        img.save(file_path, optimize=True)


def process_images(directory, size_limit=2 * 1024 * 1024, max_size=(1920, 1080)):
    """
    Process PNG images in a directory, resizing them if they exceed the size limit.
    :param directory: Path to the directory containing PNG images
    :param size_limit: File size limit in bytes (default: 2MB)
    :param max_size: Maximum size for resizing (default: 1920x1080)
    """
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)

        if not os.path.isfile(file_path):
            continue  # Skip directories and non-files

        if filename.lower().endswith('.png'):
            file_size = os.path.getsize(file_path)

            if file_size > size_limit:
                print(
                    f"Resizing {filename}: ({file_size / (1024 * 1024):.2f} MB).")
                compress_image(Path(file_path))
                new_size = os.path.getsize(file_path)
                print(
                    f"{filename} is resized to ({new_size / (1024 * 1024):.2f} MB).")
            else:
                print(
                    f"{filename} is under the size limit ({file_size / (1024 * 1024):.2f} MB). Skipping.")


# Usage
directory_path = 'public/stickers/output'
process_images(directory_path, MAX_SIZE)
