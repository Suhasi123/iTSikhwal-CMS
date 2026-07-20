from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.categories import router as category_router
from app.api.blogs import router as blog_router
from app.api.uploads import router as upload_router


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

app.include_router(
    category_router,
    prefix="/api",
)

app.include_router(
    blog_router,
    prefix="/api",
)

app.include_router(
    upload_router,
    prefix="/api",
)