import os
from PIL import Image


def resize_image(file_path, max_size=(1920, 1080)):
    """
    Resize the image to fit within the given max size while maintaining aspect ratio.
    :param file_path: Path to the image file
    :param max_size: Maximum size as a tuple (width, height)
    """
    with Image.open(file_path) as img:
        img.thumbnail(max_size)
        img.save(file_path, optimize=True)


def process_images(directory, size_limit=3 * 1024 * 1024, max_size=(1920, 1080)):
    """
    Process PNG images in a directory, resizing them if they exceed the size limit.
    :param directory: Path to the directory containing PNG images
    :param size_limit: File size limit in bytes (default: 5MB)
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
                    f"Resizing {filename} (Size: {file_size / (1024 * 1024):.2f} MB)...")
                resize_image(file_path, max_size)
                print(f"{filename} resized.")
            else:
                print(
                    f"{filename} is under the size limit ({file_size / (1024 * 1024):.2f} MB). Skipping.")


# Usage
directory_path = 'public/shirts/output'
process_images(directory_path)
