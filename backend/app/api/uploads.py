from fastapi import APIRouter, Depends, File, UploadFile

from app.core.dependencies import get_current_user
from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post(
    "",
    response_model=UploadResponse,
)
def upload_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    return UploadService.upload_image(file)