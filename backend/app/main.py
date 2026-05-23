from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
import app.models
from app.routes import auth, tasks

app = FastAPI(title=settings.APP_NAME)

origins = settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}