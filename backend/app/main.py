from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.categories import router as category_router
from app.api.blogs import router as blog_router
from app.api.uploads import router as upload_router
from app.api.public import router as public_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="iTSikhwal CMS API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",

        # Add this
        "https://id-preview--14872573-dfca-4fc1-b3c9-6bd26c48a4e6.lovable.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(
    public_router,
    prefix="/api"
)

app.include_router(
    dashboard_router,
    prefix="/api"
)