import app.core.cloudinary
import cloudinary.uploader


class UploadService:

    @staticmethod
    def upload_image(file):
        result = cloudinary.uploader.upload(
            file.file,
            folder="designxr/blogs",
            resource_type="image",
        )

        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "width": result["width"],
            "height": result["height"],
        }