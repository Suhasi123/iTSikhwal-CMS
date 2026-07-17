from fastapi import FastAPI

app = FastAPI(
    title="iTSikhwal CMS API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "CMS Backend Running "}