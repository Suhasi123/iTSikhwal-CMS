from fastapi import FastAPI
from app.api.auth import router as auth_router

app = FastAPI(
    title="iTSikhwal CMS API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "CMS Backend Running "}

app.include_router(
    auth_router,
    prefix="/api"
)